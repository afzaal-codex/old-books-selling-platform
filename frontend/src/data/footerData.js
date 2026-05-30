import { companyData } from "./companyData";

export const footerLinks = {
  quickLinks: [
    {
      label: "Home",
      path: "/",
    },

    {
      label: "Books",
      path: "/books",
    },

    {
      label: "Offers",
      path: "/offers",
    },

    {
      label: "Sell Your Book",
      path: "/sell-book",
    },

    {
      label: "About",
      path: "/about",
    },

    {
      label: "Contact",
      path: "/contact",
    },
  ],

  legalLinks: [
    {
      label: "Privacy Policy",
      path:
        companyData.legal.privacyPolicy,
    },

    {
      label: "Terms & Conditions",
      path:
        companyData.legal
          .termsConditions,
    },

    {
      label: "Return Policy",
      path:
        companyData.legal.returnPolicy,
    },
  ],
};