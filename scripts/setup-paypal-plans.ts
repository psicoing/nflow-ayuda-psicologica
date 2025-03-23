import fetch from 'node-fetch';

const API_BASE = 'https://api-m.sandbox.paypal.com'; // Sandbox para pruebas

async function getToken(clientId: string, secret: string) {
  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  });

  if (!res.ok) {
    throw new Error(`Error al obtener token: ${await res.text()}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function createProduct(token: string) {
  const res = await fetch(`${API_BASE}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'NFlow Mental Health Support',
      description: 'Servicio de apoyo psicológico con IA',
      type: 'SERVICE',
      category: 'SOFTWARE',
    })
  });

  if (!res.ok) {
    throw new Error(`Error al crear producto: ${await res.text()}`);
  }

  return await res.json();
}

async function createSubscriptionPlan(token: string, productId: string, planData: any) {
  const res = await fetch(`${API_BASE}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      name: planData.name,
      description: planData.description,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: 1
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: planData.price,
              currency_code: "EUR"
            }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: "0",
          currency_code: "EUR"
        },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3
      }
    })
  });

  if (!res.ok) {
    throw new Error(`Error al crear plan: ${await res.text()}`);
  }

  return await res.json();
}

async function main() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    throw new Error('Se requieren las credenciales de PayPal');
  }

  try {
    console.log('🔐 Obteniendo token...');
    const token = await getToken(clientId, secret);
    console.log('✅ Token obtenido');

    console.log('\n📦 Creando producto...');
    const product = await createProduct(token);
    console.log('✅ Producto creado:', product.id);

    const plans = [
      {
        name: "Plan Básico",
        description: "Plan básico con mensajes ilimitados y soporte premium",
        price: "2.99"
      },
      {
        name: "Plan Avanzado",
        description: "Plan avanzado con 50% de recursos y mejor tiempo de respuesta",
        price: "9.99"
      },
      {
        name: "Plan Premium",
        description: "Plan premium con acceso total a recursos y funcionalidades exclusivas",
        price: "14.99"
      }
    ];

    console.log('\n📋 Creando planes de suscripción...');
    for (const planData of plans) {
      const plan = await createSubscriptionPlan(token, product.id, planData);
      console.log(`✅ Plan ${planData.name} creado:`, plan.id);
    }

    console.log('\n✨ Configuración completada exitosamente');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
