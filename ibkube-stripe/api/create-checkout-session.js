const Stripe = require('stripe');

// =====================================================
// STRIPE
// =====================================================

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY não está definida no Vercel');
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


// =====================================================
// API
// =====================================================

module.exports = async (req, res) => {

    // =================================================
    // CORS
    // =================================================

    const allowedOrigins = [
        'https://digityone1.github.io',
        'https://digityone1.vercel.app'
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader(
            'Access-Control-Allow-Origin',
            origin
        );
    }

    res.setHeader(
        'Access-Control-Allow-Methods',
        'POST, OPTIONS'
    );

    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type'
    );

    res.setHeader(
        'Vary',
        'Origin'
    );


    // =================================================
    // CORS PREFLIGHT
    // =================================================

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }


    // =================================================
    // ONLY POST
    // =================================================

    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }


    try {

        // =================================================
        // CHECK STRIPE KEY
        // =================================================

        if (!process.env.STRIPE_SECRET_KEY) {

            throw new Error(
                'STRIPE_SECRET_KEY não está configurada no Vercel.'
            );

        }


        // =================================================
        // GET CART DATA
        // =================================================

        const {
            cart,
            coupon
        } = req.body || {};


        // =================================================
        // CHECK CART
        // =================================================

        if (!Array.isArray(cart) || cart.length === 0) {

            return res.status(400).json({
                error: 'Carrinho vazio.'
            });

        }


        // =================================================
        // CREATE STRIPE LINE ITEMS
        // =================================================

        const lineItems = cart.map((item) => {

            const title =
                String(item.title || '').trim();


            const price =
                Number(item.price);


            const quantity =
                Math.max(
                    1,
                    parseInt(item.qty) || 1
                );


            // ---------------------------------------------
            // VALIDATE PRODUCT
            // ---------------------------------------------

            if (!title) {

                throw new Error(
                    'Produto sem título.'
                );

            }


            if (!Number.isFinite(price)) {

                throw new Error(
                    `Preço inválido para o produto: ${title}`
                );

            }


            if (price <= 0) {

                throw new Error(
                    `Preço inválido para o produto: ${title}`
                );

            }


            // ---------------------------------------------
            // RETURN STRIPE LINE ITEM
            // ---------------------------------------------

            return {

                price_data: {

                    currency: 'eur',

                    product_data: {
                        name: title
                    },

                    unit_amount:
                        Math.round(price * 100)

                },

                quantity: quantity

            };

        });


        // =================================================
        // COUPONS
        // =================================================

        let discounts = [];


        // -------------------------------------------------
        // WELCOME10
        // -------------------------------------------------

        if (coupon === 'WELCOME10') {

            const stripeCoupon =
                await stripe.coupons.create({

                    percent_off: 10,

                    duration: 'once'

                });


            discounts.push({
                coupon: stripeCoupon.id
            });

        }


        // -------------------------------------------------
        // SAVE70
        // -------------------------------------------------

        if (coupon === 'SAVE70') {

            const stripeCoupon =
                await stripe.coupons.create({

                    percent_off: 70,

                    duration: 'once'

                });


            discounts.push({
                coupon: stripeCoupon.id
            });

        }


        // =================================================
        // CREATE STRIPE CHECKOUT SESSION
        // =================================================

        const session =
            await stripe.checkout.sessions.create({

                mode: 'payment',

                line_items: lineItems,

                ...(discounts.length > 0
                    ? {
                        discounts: discounts
                    }
                    : {}),

                billing_address_collection:
                    'required',

                success_url:
                    'https://digityone1.vercel.app/success.html',

                cancel_url:
                    'https://digityone1.vercel.app/cart.html'

            });


        // =================================================
        // RETURN CHECKOUT URL
        // =================================================

        return res.status(200).json({

            url: session.url

        });


    } catch (error) {

        // =================================================
        // ERROR
        // =================================================

        console.error(
            'Stripe Checkout Error:',
            error
        );


        return res.status(500).json({

            error:
                error.message ||
                'Erro desconhecido no Stripe.',

            type:
                error.type ||
                null,

            code:
                error.code ||
                null

        });

    }

};