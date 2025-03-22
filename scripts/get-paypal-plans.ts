import fetch from 'node-fetch';

// Cambiamos a sandbox para pruebas
const API_BASE = 'https://api-m.sandbox.paypal.com';

async function getToken(clientId: string, secret: string) {
  try {
    console.log('🔑 Intentando obtener token con las credenciales proporcionadas...');
    console.log('   Client ID:', clientId.substring(0, 4) + '...');

    const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${secret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Error al obtener token: ${error}`);
    }

    const data = await res.json();
    return data.access_token;
  } catch (error) {
    console.error('❌ Error al obtener token:', error);
    throw error;
  }
}

async function getProducts(token: string) {
  try {
    console.log('📦 Consultando productos...');
    const res = await fetch(`${API_BASE}/v1/catalogs/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Error al obtener productos: ${error}`);
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    throw error;
  }
}

async function getPlans(token: string, productId: string) {
  try {
    console.log(`📋 Consultando planes para el producto ${productId}...`);
    const res = await fetch(`${API_BASE}/v1/billing/plans?product_id=${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Error al obtener planes: ${error}`);
    }

    const data = await res.json();
    return data.plans || [];
  } catch (error) {
    console.error('❌ Error al obtener planes:', error);
    throw error;
  }
}

async function main() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    console.error('❌ Se requieren las credenciales de PayPal: PAYPAL_CLIENT_ID y PAYPAL_SECRET');
    return;
  }

  try {
    console.log('🔐 Obteniendo token...');
    const token = await getToken(clientId, secret);
    console.log('✅ Token obtenido correctamente');

    console.log('\n📦 Buscando productos...');
    const products = await getProducts(token);

    if (!products.length) {
      console.log('❌ No se encontraron productos.');
      return;
    }

    for (const product of products) {
      console.log(`\n🔹 PRODUCTO: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Descripción: ${product.description || 'No disponible'}`);

      const plans = await getPlans(token, product.id);

      if (!plans.length) {
        console.log('   ⚠️ No hay planes asociados');
        continue;
      }

      for (const plan of plans) {
        console.log(`\n   ➤ Plan: ${plan.name} (${plan.status})`);
        console.log(`     ID: ${plan.id}`);
        console.log(`     Precio: ${plan.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.value} ${plan.billing_cycles?.[0]?.pricing_scheme?.fixed_price?.currency_code}`);
        console.log(`     Descripción: ${plan.description || 'No disponible'}`);
        console.log(`     Intervalo: ${plan.billing_cycles?.[0]?.frequency?.interval_unit} (cada ${plan.billing_cycles?.[0]?.frequency?.interval_count} unidad(es))`);
      }
    }
  } catch (err) {
    console.error('💥 Error:', err);
  }
}

main();