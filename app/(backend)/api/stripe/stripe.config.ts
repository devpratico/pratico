/**
 * These are Stripe info (not sensitive) that are used in the app.
 * Depending on the environment, the values will be different.
 */
const config = {

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