import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function listPrices() {
  try {
    const prices = await stripe.prices.list({
      limit: 10,
      expand: ['data.product']
    });

    console.log('Precios disponibles:');
    prices.data.forEach(price => {
      console.log(`\nID del precio: ${price.id}`);
      console.log(`Producto: ${price.product.name}`);
      console.log(`Monto: ${price.unit_amount / 100} ${price.currency.toUpperCase()}`);
      console.log(`Tipo: ${price.type}`);
      console.log(`Intervalo: ${price.recurring?.interval || 'único'}`);
    });
  } catch (error) {
    console.error('Error al obtener los precios:', error.message);
  }
}

listPrices();