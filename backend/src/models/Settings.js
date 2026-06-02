import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    supportEmail: {
      type: String,
      default: "",
    },

    supportPhone: {
      type: String,
      default: "",
    },

    showStock: {
      type: Boolean,
      default: true,
    },

    socialLinks: {
      facebook: {
        type: String,
        default: "",
      },

      instagram: {
        type: String,
        default: "",
      },

      whatsapp: {
        type: String,
        default: "",
      },

      whatsappMessage: {
        type: String,
        default: "",
      },

      youtube: {
        type: String,
        default: "",
      },
    },

    paymentMethods: {
      jazzcash: {
        number: {
          type: String,
          default: "",
        },

        accountTitle: {
          type: String,
          default: "",
        },
      },

      easypaisa: {
        number: {
          type: String,
          default: "",
        },

        accountTitle: {
          type: String,
          default: "",
        },
      },

      bankTransfer: {
        bankName: {
          type: String,
          default: "",
        },

        accountNumber: {
          type: String,
          default: "",
        },

        accountTitle: {
          type: String,
          default: "",
        },
      },
    },

    deliveryCharges: {
      type: Map,
      of: Number,
      default: {},
    },

    useFlatDeliveryRate: {
      type: Boolean,
      default: false,
    },

    flatDeliveryRate: {
      type: Number,
      default: 150,
    },

    homepageSections: {
      hero: { type: Boolean, default: true },
      highDiscount: { type: Boolean, default: true },
      bestSeller: { type: Boolean, default: true },
      featuredBooks: { type: Boolean, default: true },
      trendingAuthors: { type: Boolean, default: true },
      trendingCategories: { type: Boolean, default: true },
      newReleases: { type: Boolean, default: true },
      trendingThisWeek: { type: Boolean, default: true },
      offersThisWeek: { type: Boolean, default: true },
      antiqueBooks: { type: Boolean, default: true },
      signedBooks: { type: Boolean, default: true },
      vintageFinds: { type: Boolean, default: true },
    },

    secondaryNav: {
      featuredBooks: { type: Boolean, default: true },
      bestSeller: { type: Boolean, default: true },
      highDiscount: { type: Boolean, default: true },
      trendingThisWeek: { type: Boolean, default: false },
      newReleases: { type: Boolean, default: false },
      offersThisWeek: { type: Boolean, default: false },
      antiqueBooks: { type: Boolean, default: false },
      signedBooks: { type: Boolean, default: false },
      vintageFinds: { type: Boolean, default: false },
      recommended: { type: Boolean, default: false },
    },

    heroSection: {
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
      },
      books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
      }],
      button1Text: {
        type: String,
        default: "SELL YOUR BOOK"
      },
      button1Link: {
        type: String,
        default: "/contact"
      },
      button2Text: {
        type: String,
        default: "CHOOSE FROM US"
      },
      button2Link: {
        type: String,
        default: "/books"
      },
      primaryLine: {
        type: String,
        default: "Where Every Page\u00A0Whispers History."
      },
      secondaryLine: {
        type: String,
        default: "Rare Volumes. Timeless\u00A0Souls."
      }
    },

    promotionalDiscount: {
      title: { type: String, default: "" },
      slogan: { type: String, default: "" },
      image: { type: String, default: "" },
      discountValue: { type: Number, default: 0 },
      isActive: { type: Boolean, default: true },
      buttonText: { type: String, default: "Avail This Offer" },
      buttonLink: { type: String, default: "/offers" },
    },

    promoSection: {
      tagline: { type: String, default: "✦ LIMITED TIME OFFER ✦" },
      headline: { type: String, default: "Enjoy an Exclusive" },
      discountValue: { type: Number, default: 40 },
      subCopy: { type: String, default: "On all rare & collectible editions — this weekend only" },
      buttonText: { type: String, default: "SHOP NOW" },
      buttonLink: { type: String, default: "/books?promo=true" },
      promoCode: { type: String, default: "RARE40" },
      isActive: { type: Boolean, default: true },
      bgImage: { type: String, default: "" },
      cardImage: { type: String, default: "" },
      endsAt: { type: Date, default: null },
      discountBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    },

    connectSection: {
      eyebrow: { type: String, default: "The Old Shelf · Newsletter" },
      heading: { type: String, default: "Stay Within the Pages" },
      headingEm: { type: String, default: "the Pages" },
      description: {
        type: String,
        default: "Rare arrivals, weekly curations & exclusive offers — delivered quietly to your inbox like a letter from a distant library.",
      },
      bgImage: { type: String, default: "" },
      cardImage: { type: String, default: "" },
      buttonText: { type: String, default: "Connect" },
    },


    discountStrip: {
      text: { type: String, default: "" },
      offerContent: { type: String, default: "" },
      backgroundColor: { type: String, default: "#c8860a" },
      textColor: { type: String, default: "#ffffff" },
      promotionalLabel: { type: String, default: "" },
      announcement: { type: String, default: "" },
      isActive: { type: Boolean, default: false },
    },

    seo: {
      title: { type: String, default: "BookWorld" },
      description: { type: String, default: "Online Old Book Store" },
      keywords: { type: String, default: "old books, used books, bookstore" },
    },

    loginContent: {
      eyebrow: { type: String, default: "Bookstore Account" },
      title: { type: String, default: "Welcome Back" },
      subtitle: { type: String, default: "Login to continue your reading journey" },
    },

    emailTemplates: {
      orderConfirmationSubject: {
        type: String,
        default: "Order Confirmed - {orderNumber}",
      },
      orderConfirmationBody: {
        type: String,
        default: "Thank you for shopping with us! Your order has been received and is being processed.",
      },
      orderUpdateSubject: {
        type: String,
        default: "Order Update - {orderNumber} is now {orderStatus}",
      },
      orderUpdateBody: {
        type: String,
        default: "We wanted to let you know that the status of your order {orderNumber} has been updated to {orderStatus}.",
      },
      paymentFailureSubject: {
        type: String,
        default: "Payment Failed - Order {orderNumber}",
      },
      paymentFailureBody: {
        type: String,
        default: "We were unable to verify your payment for order {orderNumber}. Please check details, try again, or contact support.",
      },
      feedbackSubject: {
        type: String,
        default: "We'd love your feedback! - Order {orderNumber}",
      },
      feedbackBody: {
        type: String,
        default: "How did you like your books and our service? Please share a review on the store!",
      },
      newsletterWelcomeSubject: {
        type: String,
        default: "Welcome to Our Newsletter!",
      },
      newsletterWelcomeBody: {
        type: String,
        default: "Thank you for subscribing! You are on our list, we will inform you about our rare books and updates.",
      },
      connectWelcomeSubject: {
        type: String,
        default: "Thank you for connecting with us!",
      },
      connectWelcomeBody: {
        type: String,
        default: "You are on our list, we will inform you. We'll be in touch shortly!",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
