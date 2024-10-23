/**
 * These are Stripe info (not sensitive) that are used in the app.
 * Depending on the environment, the values will be different.
 * We generally use process.env.NODE_ENV to determine the environment.
 * In Vercel previews, the environment is 'production'.
 */
const config = {

    // There are several products in Stripe
    productsIds: {
        // Old version of Pratico (Firebase style)
        pratico_v1: {
            production:  "prod_NXMCHpjhewJPiL",
            development: "prod_O1c72yjoPwZbov",
            test:        "prod_O1c72yjoPwZbov",
        },

        // Current version
        pratico_v2: {
            production:  "prod_PY2GyLaRF8LO7Y",
            development: "prod_PYo0XihRb5NUvN",
            test:        "prod_PYo0XihRb5NUvN",
        },
    },

    // Used to show the pricing table Stripe component
    pricingTableId: {
        production:  "prctbl_1QCHklHe86NEHYtmJjE5iEU3",
        development: "prctbl_1QCIDQHe86NEHYtmuGCQEDOr",
        test:        "prctbl_1QCIDQHe86NEHYtmuGCQEDOr",
    },

    // Used to redirect the user when wanting to manage its subscription
    customerPortalUrl: {
        production:  "https://billing.stripe.com/p/login/aEU3cng2g2J74bS6oo",
        development: "https://billing.stripe.com/p/login/test_eVa00Ybcs9x78Ew6oo",
        test:        "https://billing.stripe.com/p/login/test_eVa00Ybcs9x78Ew6oo",
    }
};

export default config;