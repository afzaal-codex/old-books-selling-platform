import mongoose from "mongoose";
import Book from "./models/Book.js";
import Settings from "./models/Settings.js";
import Author from "./models/Author.js";
import Category from "./models/Category.js";
import User from "./models/User.js";
import Coupon from "./models/Coupon.js";
import Review from "./models/Review.js";
import Order from "./models/Order.js";
import Newsletter from "./models/Newsletter.js";
import Notification from "./models/Notification.js";
import Connect from "./models/Connect.js";
import Wishlist from "./models/Wishlist.js";
import BookRequest from "./models/BookRequest.js";
import Payment from "./models/Payment.js";
import Otp from "./models/Otp.js";
import AdminOtp from "./models/AdminOtp.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/oldbooksstore";

const newBooks = [
  // J.K. Rowling (68315d111111111111111114, Category: Fiction: 68315d222222222222222224)
  {
    title: "Harry Potter and the Chamber of Secrets",
    slug: "harry-potter-and-the-chamber-of-secrets",
    author: "68315d111111111111111114",
    category: "68315d222222222222222224",
    description: "The Dursleys were so mean and hideous that summer that all Harry Potter wanted was to get back to the Hogwarts School for Witchcraft and Wizardry.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/81S0nNQVE5L.jpg"],
    originalPrice: 999,
    discountedPrice: 850,
    discountPercentage: 15,
    stock: 12,
    bookType: "New",
    bindingType: "Paperback",
    totalPages: 341,
    condition: "New",
    featured: true,
    bestseller: true,
    trending: true,
    recommended: true,
    averageRating: 4.8,
    totalReviews: 240,
    publisher: "Scholastic",
    bookFormat: "Paperback",
    language: "English",
    publicationYear: "1998",
  },
  {
    title: "Harry Potter and the Prisoner of Azkaban",
    slug: "harry-potter-and-the-prisoner-of-azkaban",
    author: "68315d111111111111111114",
    category: "68315d222222222222222224",
    description: "For twelve long years, the dread fortress of Azkaban held an infamous prisoner named Sirius Black. Convicted of killing thirteen people with a single curse, he was said to be the heir apparent to the Dark Lord, Voldemort.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/81lAPl9Fl0L.jpg"],
    originalPrice: 1100,
    discountedPrice: 950,
    discountPercentage: 14,
    stock: 8,
    bookType: "Old",
    conditionDetails: "Slight wear on spine, clean pages",
    bindingType: "Hard Binding",
    totalPages: 435,
    condition: "Used",
    featured: false,
    bestseller: true,
    trending: false,
    recommended: true,
    averageRating: 4.9,
    totalReviews: 310,
    publisher: "Scholastic",
    bookFormat: "Hardcover",
    language: "English",
    publicationYear: "1999",
  },
  {
    title: "Harry Potter and the Goblet of Fire",
    slug: "harry-potter-and-the-goblet-of-fire",
    author: "68315d111111111111111114",
    category: "68315d222222222222222224",
    description: "The Triwizard Tournament is to be held at Hogwarts. Only wizards who are over seventeen are allowed to enter—but that doesn't stop Harry dreaming that he will win the competition.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/81t2CV8vGyL.jpg"],
    originalPrice: 1250,
    discountedPrice: 1100,
    discountPercentage: 12,
    stock: 5,
    bookType: "New",
    bindingType: "Paperback",
    totalPages: 734,
    condition: "New",
    featured: true,
    bestseller: false,
    trending: true,
    recommended: false,
    averageRating: 4.7,
    totalReviews: 185,
    publisher: "Scholastic",
    bookFormat: "Paperback",
    language: "English",
    publicationYear: "2000",
  },

  // Cal Newport (68315d111111111111111115, Category: Self-Help: 68315d222222222222222222)
  {
    title: "Digital Minimalism",
    slug: "digital-minimalism",
    author: "68315d111111111111111115",
    category: "68315d222222222222222222",
    description: "A practical guide to reclaiming our attention, focusing on what truly matters, and building a more meaningful life in a hyper-connected world.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/41-AQA4lH6L._SX329_BO1,204,203,200_.jpg"],
    originalPrice: 850,
    discountedPrice: 750,
    discountPercentage: 12,
    stock: 15,
    bookType: "New",
    bindingType: "Paperback",
    totalPages: 302,
    condition: "New",
    featured: true,
    bestseller: true,
    trending: true,
    recommended: true,
    averageRating: 4.5,
    totalReviews: 145,
    publisher: "Portfolio",
    bookFormat: "Paperback",
    language: "English",
    publicationYear: "2019",
  },
  {
    title: "So Good They Can't Ignore You",
    slug: "so-good-they-cant-ignore-you",
    author: "68315d111111111111111115",
    category: "68315d222222222222222222",
    description: "Newport debunks the belief that 'following your passion' is good career advice, showing instead that skill and craftsmanship are what build deep satisfaction.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/51wXpQA9x3L._SX329_BO1,204,203,200_.jpg"],
    originalPrice: 800,
    discountedPrice: 680,
    discountPercentage: 15,
    stock: 6,
    bookType: "Old",
    conditionDetails: "Good condition, no highlights",
    bindingType: "Paperback",
    totalPages: 288,
    condition: "Used",
    featured: false,
    bestseller: true,
    trending: false,
    recommended: true,
    averageRating: 4.6,
    totalReviews: 98,
    publisher: "Grand Central Publishing",
    bookFormat: "Paperback",
    language: "English",
    publicationYear: "2012",
  },
  {
    title: "A World Without Email",
    slug: "a-world-without-email",
    author: "68315d111111111111111115",
    category: "68315d222222222222222222",
    description: "Reimagining work in an age of communication overload, Newport shows how organizations can escape the hyperactive hive mind and increase both productivity and peace.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/41T-m4fpxkL._SX327_BO1,204,203,200_.jpg"],
    originalPrice: 950,
    discountedPrice: 890,
    discountPercentage: 6,
    stock: 4,
    bookType: "New",
    bindingType: "Hard Binding",
    totalPages: 320,
    condition: "New",
    featured: true,
    bestseller: false,
    trending: true,
    recommended: false,
    averageRating: 4.3,
    totalReviews: 42,
    publisher: "Portfolio",
    bookFormat: "Hardcover",
    language: "English",
    publicationYear: "2021",
  },

  // James Clear (68315d111111111111111111, Category: Self-Help: 68315d222222222222222222)
  {
    title: "Atomic Habits Journal",
    slug: "atomic-habits-journal",
    author: "68315d111111111111111111",
    category: "68315d222222222222222222",
    description: "The ultimate companion to James Clear's groundbreaking book, designed to help you track habits, reflect on progress, and design your daily routines.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/81iWvF9N4BL.jpg"],
    originalPrice: 650,
    discountedPrice: 550,
    discountPercentage: 15,
    stock: 20,
    bookType: "New",
    bindingType: "Spiral Binding",
    totalPages: 224,
    condition: "New",
    featured: true,
    bestseller: true,
    trending: true,
    recommended: true,
    averageRating: 4.7,
    totalReviews: 89,
    publisher: "Avery",
    bookFormat: "Spiral Bound",
    language: "English",
    publicationYear: "2018",
  },
  {
    title: "3-2-1 Wisdom Anthology",
    slug: "3-2-1-wisdom-anthology",
    author: "68315d111111111111111111",
    category: "68315d222222222222222222",
    description: "A compiled anthology of thoughts, ideas, and quotes from James Clear's famous weekly newsletters focusing on self-mastery, focus, and decision making.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/41gPqOaQ6DL.jpg"],
    originalPrice: 450,
    discountedPrice: 400,
    discountPercentage: 11,
    stock: 10,
    bookType: "Old",
    conditionDetails: "Cover slightly bent, clean pages",
    bindingType: "Paperback",
    totalPages: 150,
    condition: "Used",
    featured: false,
    bestseller: false,
    trending: false,
    recommended: true,
    averageRating: 4.4,
    totalReviews: 32,
    publisher: "Self-Published",
    bookFormat: "Paperback",
    language: "English",
    publicationYear: "2020",
  },
  {
    title: "Mastery of Tiny Behaviors",
    slug: "mastery-of-tiny-behaviors",
    author: "68315d111111111111111111",
    category: "68315d222222222222222222",
    description: "An advanced guide digging deeper into behavioural psychological research to sustain massive lifestyle modifications over decades.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/51wU0eA9xKL.jpg"],
    originalPrice: 899,
    discountedPrice: 799,
    discountPercentage: 11,
    stock: 5,
    bookType: "New",
    bindingType: "Paperback",
    totalPages: 312,
    condition: "New",
    featured: true,
    bestseller: true,
    trending: false,
    recommended: false,
    averageRating: 4.6,
    totalReviews: 28,
    publisher: "Avery",
    bookFormat: "Paperback",
    language: "English",
    publicationYear: "2022",
  },

  // Robert Kiyosaki (68315d111111111111111112, Category: Business & Finance: 68315d222222222222222223)
  {
    title: "Rich Dad's Cashflow Quadrant",
    slug: "rich-dads-cashflow-quadrant",
    author: "68315d111111111111111112",
    category: "68315d222222222222222223",
    description: "Guide to Financial Freedom. It reveals how some people work less, earn more, pay less in taxes, and learn to become financially free.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/51f8vK9B3xL._SX331_BO1,204,203,200_.jpg"],
    originalPrice: 900,
    discountedPrice: 799,
    discountPercentage: 11,
    stock: 14,
    bookType: "New",
    bindingType: "Paperback",
    totalPages: 376,
    condition: "New",
    featured: true,
    bestseller: true,
    trending: true,
    recommended: true,
    averageRating: 4.6,
    totalReviews: 198,
    publisher: "Plata Publishing",
    bookFormat: "Paperback",
    language: "English",
    publicationYear: "1998",
  },
  {
    title: "Rich Dad's Guide to Investing",
    slug: "rich-dads-guide-to-investing",
    author: "68315d111111111111111112",
    category: "68315d222222222222222223",
    description: "What the rich invest in that the poor and middle class do not! Learn the rules of investing, reduce investment risk, and convert earned income into passive income.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/51F0D4w3hKL.jpg"],
    originalPrice: 999,
    discountedPrice: 850,
    discountPercentage: 15,
    stock: 9,
    bookType: "Old",
    conditionDetails: "Good overall condition, slight pencil marks on 3 pages",
    bindingType: "Paperback",
    totalPages: 400,
    condition: "Used",
    featured: false,
    bestseller: true,
    trending: false,
    recommended: true,
    averageRating: 4.5,
    totalReviews: 120,
    publisher: "Plata Publishing",
    bookFormat: "Paperback",
    language: "English",
    publicationYear: "2012",
  },
  {
    title: "Retire Young Retire Rich",
    slug: "retire-young-retire-rich",
    author: "68315d111111111111111112",
    category: "68315d222222222222222223",
    description: "How to get rich quickly and stay rich forever. This book covers how Kiyosaki started from nothing and retired in less than 10 years by using financial leverage.",
    images: ["https://images-na.ssl-images-amazon.com/images/I/51A31B8wS4L.jpg"],
    originalPrice: 850,
    discountedPrice: 799,
    discountPercentage: 6,
    stock: 7,
    bookType: "New",
    bindingType: "Paperback",
    totalPages: 395,
    condition: "New",
    featured: true,
    bestseller: false,
    trending: true,
    recommended: false,
    averageRating: 4.4,
    totalReviews: 87,
    publisher: "Plata Publishing",
    bookFormat: "Paperback",
    language: "English",
    publicationYear: "2002",
  },
];

// =========================================
// AUTHORS DATA
// =========================================
const newAuthors = [
  {
    name: "J.K. Rowling",
    slug: "j-k-rowling",
    bio: "Joanne Rowling is a British author, screenwriter and producer best known as the author of the Harry Potter fantasy series.",
    image: "https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/images/30cf6144-b37b-4fbe-8d6d-b45f2d2d2e7d._SX300_SY300_.jpg",
    featured: true,
  },
  {
    name: "Cal Newport",
    slug: "cal-newport",
    bio: "Cal Newport is a bestselling author and computer scientist known for his works on productivity and focused work.",
    image: "https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/images/5d4f8e9c-3b2e-4a8b-9c1f-2e8d7c6b5a4f._SX300_SY300_.jpg",
    featured: true,
  },
  {
    name: "James Clear",
    slug: "james-clear",
    bio: "James Clear is a bestselling author and habit formation expert, best known for Atomic Habits.",
    image: "https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/images/8e9f7d6c-5b4a-3c2d-1e0f-9a8b7c6d5e4f._SX300_SY300_.jpg",
    featured: true,
  },
  {
    name: "Robert Kiyosaki",
    slug: "robert-kiyosaki",
    bio: "Robert Kiyosaki is an American businessman and author known for his Rich Dad Poor Dad series on financial literacy.",
    image: "https://images-na.ssl-images-amazon.com/images/S/amzn-author-media-prod/images/2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f._SX300_SY300_.jpg",
    featured: true,
  },
];

// =========================================
// CATEGORIES DATA
// =========================================
const newCategories = [
  {
    name: "Fiction",
    slug: "fiction",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1491567910p._SX300_SY300_.jpg",
    featured: true,
    isActive: true,
  },
  {
    name: "Self-Help",
    slug: "self-help",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1491567910p._SX300_SY300_.jpg",
    featured: true,
    isActive: true,
  },
  {
    name: "Business & Finance",
    slug: "business-finance",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1491567910p._SX300_SY300_.jpg",
    featured: true,
    isActive: true,
  },
  {
    name: "Educational",
    slug: "educational",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1491567910p._SX300_SY300_.jpg",
    featured: false,
    isActive: true,
  },
  {
    name: "Mystery & Thriller",
    slug: "mystery-thriller",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1491567910p._SX300_SY300_.jpg",
    featured: true,
    isActive: true,
  },
  {
    name: "Romance",
    slug: "romance",
    image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1491567910p._SX300_SY300_.jpg",
    featured: false,
    isActive: true,
  },
];

// =========================================
// USERS DATA - Function to generate password hashes
// =========================================
async function generateUserData() {
  return [
    {
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      phone: "+92 300 1234567",
      password: await bcryptjs.hash("password123", 10),
      isVerified: true,
      isBlocked: false,
      isInactive: false,
      lastActiveAt: new Date(),
    },
    {
      name: "Fatima Khan",
      email: "fatima@example.com",
      phone: "+92 300 7654321",
      password: await bcryptjs.hash("password123", 10),
      isVerified: true,
      isBlocked: false,
      isInactive: false,
      lastActiveAt: new Date(),
    },
    {
      name: "Ali Raza",
      email: "ali@example.com",
      phone: "+92 321 9876543",
      password: await bcryptjs.hash("password123", 10),
      isVerified: true,
      isBlocked: false,
      isInactive: false,
      lastActiveAt: new Date(),
    },
  ];
}

// =========================================
// COUPONS DATA
// =========================================
const newCoupons = [
  {
    code: "RARE40",
    discountType: "percentage",
    discountValue: 40,
    minOrderAmount: 500,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    usageLimit: 100,
    usedCount: 0,
    isActive: true,
  },
  {
    code: "NEWYEAR2024",
    discountType: "percentage",
    discountValue: 25,
    minOrderAmount: 1000,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    usageLimit: 50,
    usedCount: 0,
    isActive: true,
  },
  {
    code: "FLAT500",
    discountType: "fixed",
    discountValue: 500,
    minOrderAmount: 2000,
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    usageLimit: 30,
    usedCount: 0,
    isActive: true,
  },
  {
    code: "EID30",
    discountType: "percentage",
    discountValue: 30,
    minOrderAmount: 1500,
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    usageLimit: 200,
    usedCount: 15,
    isActive: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // =========================================
    // SEED CATEGORIES
    // =========================================
    const categorySlugs = newCategories.map((c) => c.slug);
    await Category.deleteMany({ slug: { $in: categorySlugs } });
    const insertedCategories = await Category.insertMany(newCategories);
    console.log(`Successfully seeded ${insertedCategories.length} categories!`);

    // =========================================
    // SEED AUTHORS
    // =========================================
    const authorSlugs = newAuthors.map((a) => a.slug);
    await Author.deleteMany({ slug: { $in: authorSlugs } });
    const insertedAuthors = await Author.insertMany(newAuthors);
    console.log(`Successfully seeded ${insertedAuthors.length} authors!`);

    // =========================================
    // UPDATE BOOKS WITH REAL IDS
    // =========================================
    const fictionCategory = insertedCategories.find(c => c.slug === 'fiction');
    const selfHelpCategory = insertedCategories.find(c => c.slug === 'self-help');
    const businessCategory = insertedCategories.find(c => c.slug === 'business-finance');
    
    const jkRowling = insertedAuthors.find(a => a.slug === 'j-k-rowling');
    const calNewport = insertedAuthors.find(a => a.slug === 'cal-newport');
    const jamesClear = insertedAuthors.find(a => a.slug === 'james-clear');
    const robertKiyosaki = insertedAuthors.find(a => a.slug === 'robert-kiyosaki');

    // Update book data with real category and author IDs
    const updatedBooks = newBooks.map(book => {
      if (book.slug.includes('harry-potter')) {
        return { ...book, category: fictionCategory._id, author: jkRowling._id };
      } else if (book.slug.includes('digital-minimalism') || book.slug.includes('world-without-email') || book.slug.includes('good-they-cant')) {
        return { ...book, category: selfHelpCategory._id, author: calNewport._id };
      } else if (book.slug.includes('atomic-habits') || book.slug.includes('3-2-1') || book.slug.includes('mastery-tiny')) {
        return { ...book, category: selfHelpCategory._id, author: jamesClear._id };
      } else if (book.slug.includes('rich-dad')) {
        return { ...book, category: businessCategory._id, author: robertKiyosaki._id };
      } else if (book.slug.includes('retire-young')) {
        return { ...book, category: businessCategory._id, author: robertKiyosaki._id };
      }
      return book;
    });

    // Delete existing books with matching slugs to re-seed clean details
    const slugs = updatedBooks.map((b) => b.slug);
    const deleteRes = await Book.deleteMany({ slug: { $in: slugs } });
    console.log(`Cleaned up ${deleteRes.deletedCount} existing seeded books.`);

    // Insert updated books
    const insertedBooks = await Book.insertMany(updatedBooks);
    console.log(`Successfully seeded ${insertedBooks.length} books with complete specifications!`);

    // =========================================
    // SEED USERS
    // =========================================
    const userEmails = ['ahmed@example.com', 'fatima@example.com', 'ali@example.com'];
    await User.deleteMany({ email: { $in: userEmails } });
    const newUsers = await generateUserData();
    const insertedUsers = await User.insertMany(newUsers);
    console.log(`Successfully seeded ${insertedUsers.length} users!`);

    // =========================================
    // SEED COUPONS
    // =========================================
    const couponCodes = newCoupons.map((c) => c.code);
    await Coupon.deleteMany({ code: { $in: couponCodes } });
    const insertedCoupons = await Coupon.insertMany(newCoupons);
    console.log(`Successfully seeded ${insertedCoupons.length} coupons!`);

    // =========================================
    // SEED REVIEWS
    // =========================================
    if (insertedBooks.length > 0 && insertedUsers.length > 0) {
      const reviewData = [
        {
          bookId: insertedBooks[0]._id,
          userId: insertedUsers[0]._id,
          rating: 5,
          title: "Amazing book! Highly recommended.",
          review: "One of the best fantasy novels I've read. The storytelling is captivating and the characters are well-developed.",
          verified: true,
        },
        {
          bookId: insertedBooks[1]._id,
          userId: insertedUsers[1]._id,
          rating: 4,
          title: "Good read with excellent pacing.",
          review: "Fast-paced action with interesting plot twists. Kept me engaged throughout.",
          verified: true,
        },
        {
          bookId: insertedBooks[2]._id,
          userId: insertedUsers[2]._id,
          rating: 5,
          title: "Best productivity book I've read.",
          review: "Clear, practical advice on building better habits. Changed my daily routine for the better.",
          verified: true,
        },
      ];
      
      const bookIds = reviewData.map(r => r.bookId);
      await Review.deleteMany({ bookId: { $in: bookIds } });
      const insertedReviews = await Review.insertMany(reviewData);
      console.log(`Successfully seeded ${insertedReviews.length} reviews!`);
    }

    // =========================================
    // SEED NEWSLETTER SUBSCRIBERS
    // =========================================
    await Newsletter.deleteMany({});
    const newsletterData = [
      {
        email: "subscriber1@example.com",
        name: "John Subscriber",
        isSubscribed: true,
      },
      {
        email: "subscriber2@example.com",
        name: "Jane Reader",
        isSubscribed: true,
      },
      {
        email: "subscriber3@example.com",
        name: "Book Lover",
        isSubscribed: true,
      },
    ];
    const insertedNewsletters = await Newsletter.insertMany(newsletterData);
    console.log(`Successfully seeded ${insertedNewsletters.length} newsletter subscribers!`);

    // =========================================
    // SEED NOTIFICATIONS
    // =========================================
    if (insertedUsers.length > 0) {
      await Notification.deleteMany({});
      const notificationData = [
        {
          userId: insertedUsers[0]._id,
          title: "Welcome to Book World!",
          message: "Thank you for joining our community of book lovers.",
          type: "welcome",
          read: false,
        },
        {
          userId: insertedUsers[1]._id,
          title: "New Rare Books Added",
          message: "Check out our latest collection of rare and vintage books.",
          type: "product",
          read: false,
        },
        {
          userId: insertedUsers[2]._id,
          title: "Special Discount Available",
          message: "Use code EID30 for 30% off on selected items.",
          type: "promotion",
          read: true,
        },
      ];
      const insertedNotifications = await Notification.insertMany(notificationData);
      console.log(`Successfully seeded ${insertedNotifications.length} notifications!`);
    }

    // =========================================
    // SEED WISHLISTS
    // =========================================
    await Wishlist.deleteMany({});
    if (insertedUsers.length > 0 && insertedBooks.length > 0) {
      const wishlistData = [
        {
          user: insertedUsers[0]._id,
          books: [insertedBooks[0]._id, insertedBooks[1]._id],
        },
        {
          user: insertedUsers[1]._id,
          books: [insertedBooks[2]._id],
        },
      ];
      const insertedWishlists = await Wishlist.insertMany(wishlistData);
      console.log(`Successfully seeded ${insertedWishlists.length} wishlists!`);
    }

    // =========================================
    // SEED CONNECT REQUESTS
    // =========================================
    await Connect.deleteMany({});
    const connectData = [
      { email: "reader1@gmail.com" },
      { email: "collector2@yahoo.com" },
    ];
    const insertedConnects = await Connect.insertMany(connectData);
    console.log(`Successfully seeded ${insertedConnects.length} connect requests!`);

    // =========================================
    // SEED BOOK REQUESTS
    // =========================================
    await BookRequest.deleteMany({});
    if (insertedUsers.length > 0) {
      const bookRequestData = [
        {
          title: "The Hobbit (First Edition)",
          author: "J.R.R. Tolkien",
          user: insertedUsers[0]._id,
          name: "Ahmed Hassan",
          email: "ahmed@example.com",
          phone: "+92 300 1234567",
          notes: "Looking for a well-preserved hardcover from the 1930s.",
          status: "Pending",
        },
        {
          title: "Fahrenheit 451",
          author: "Ray Bradbury",
          user: null,
          name: "Sajid Mahmood",
          email: "sajid@gmail.com",
          phone: "+92 321 4455667",
          notes: "Any vintage paperback copy.",
          status: "Approved",
        },
      ];
      const insertedBookRequests = await BookRequest.insertMany(bookRequestData);
      console.log(`Successfully seeded ${insertedBookRequests.length} book requests!`);
    }

    // =========================================
    // SEED ORDERS & PAYMENTS
    // =========================================
    await Order.deleteMany({});
    await Payment.deleteMany({});
    if (insertedUsers.length > 0 && insertedBooks.length > 0) {
      const orderData = [
        {
          user: insertedUsers[0]._id,
          orderItems: [
            {
              book: insertedBooks[0]._id,
              title: insertedBooks[0].title,
              image: insertedBooks[0].images?.[0] || "",
              quantity: 1,
              price: insertedBooks[0].discountedPrice || insertedBooks[0].originalPrice,
            },
          ],
          shippingAddress: {
            fullName: "Ahmed Hassan",
            city: "Lahore",
            address: "House 45, Street 3, DHA Phase 5",
            phone: "+92 300 1234567",
            email: "ahmed@example.com",
          },
          paymentMethod: "JazzCash",
          paymentStatus: "Pending",
          orderStatus: "Pending Payment Verification",
          deliveryCharges: 150,
          subtotal: insertedBooks[0].discountedPrice || insertedBooks[0].originalPrice,
          totalPrice: (insertedBooks[0].discountedPrice || insertedBooks[0].originalPrice) + 150,
          orderNumber: "ORD-" + Math.floor(100000 + Math.random() * 900000),
          transactionId: "TXN88921827",
          timeline: [
            {
              status: "Pending Payment Verification",
              notes: "Order placed, awaiting payment confirmation.",
            },
          ],
        },
      ];
      const insertedOrders = await Order.insertMany(orderData);
      console.log(`Successfully seeded ${insertedOrders.length} orders!`);

      // Seed corresponding payment
      const paymentData = [
        {
          order: insertedOrders[0]._id,
          transactionId: "TXN88921827",
          paymentMethod: "JazzCash",
          verificationStatus: "Pending",
          adminNotes: "Awaiting screenshot confirmation.",
        },
      ];
      const insertedPayments = await Payment.insertMany(paymentData);
      console.log(`Successfully seeded ${insertedPayments.length} payments!`);
    }

    // =========================================
    // CLEANUP OTPS
    // =========================================
    await Otp.deleteMany({});
    await AdminOtp.deleteMany({});
    console.log("Cleaned up OTP and AdminOtp collections.");

    // =========================================
    // SEED SETTINGS
    // =========================================
    await Settings.deleteMany({});
    const bookIds = insertedBooks.slice(0, 5).map((b) => b._id);
    
    await Settings.create({
      supportEmail: "hello@bookworld.site",
      supportPhone: "+92 300 1234567",
      socialLinks: {
        facebook: "https://facebook.com/bookworld",
        instagram: "https://instagram.com/bookworld",
        whatsapp: "https://wa.me/923001234567",
        youtube: "https://youtube.com/bookworld",
      },
      paymentMethods: {
        jazzcash: {
          number: "03001234567",
          accountTitle: "Book World Store",
        },
        easypaisa: {
          number: "03121234567",
          accountTitle: "Book World Store",
        },
        bankTransfer: {
          bankName: "Meezan Bank Limited",
          accountNumber: "02340102030405",
          accountTitle: "Book World",
        },
      },
      useFlatDeliveryRate: true,
      flatDeliveryRate: 150,
      homepageSections: {
        hero: true,
        highDiscount: true,
        bestSeller: true,
        featuredBooks: true,
        trendingAuthors: true,
        trendingCategories: true,
        newReleases: true,
        trendingThisWeek: true,
        offersThisWeek: true,
      },
      heroSection: {
        category: fictionCategory._id,
        books: bookIds,
        button1Text: "SELL YOUR BOOK",
        button1Link: "/sell-book",
        button2Text: "CHOOSE FROM US",
        button2Link: "/books",
        primaryLine: "Where Every Page\u00A0Whispers History.",
        secondaryLine: "Rare Volumes. Timeless\u00A0Souls."
      },
      promoSection: {
        tagline: "✦ LIMITED TIME OFFER ✦",
        headline: "Enjoy an Exclusive",
        discountValue: 40,
        subCopy: "On all rare & collectible editions — this weekend only",
        buttonText: "SHOP NOW",
        buttonLink: "/books?promo=true",
        promoCode: "RARE40",
        isActive: true,
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        discountBooks: bookIds.slice(0, 2),
      },
      discountStrip: {
        text: "✦ Eid Special Offer ✦",
        offerContent: "Flat 40% Off on Premium Rare Collections",
        backgroundColor: "#c8860a",
        textColor: "#ffffff",
        promotionalLabel: "Limited Time Only",
        announcement: "Free Shipping on Orders above Rs. 2000!",
        isActive: true,
      },
      seo: {
        title: "BookWorld | Online Rare & Used Books Store",
        description: "Explore a premium collection of rare, vintage, and second-hand books at Book World.",
        keywords: "old books, used books, bookstore, novels",
      },
      loginContent: {
        eyebrow: "Bookstore Account",
        title: "Welcome Back",
        subtitle: "Login to continue your reading journey",
      },
      emailTemplates: {
        orderConfirmationSubject: "Order Confirmed - {orderNumber}",
        orderConfirmationBody: "Thank you for shopping with us! Your order has been received and is being processed.",
        orderUpdateSubject: "Order Update - {orderNumber} is now {orderStatus}",
        orderUpdateBody: "We wanted to let you know that the status of your order {orderNumber} has been updated to {orderStatus}.",
        paymentFailureSubject: "Payment Failed - Order {orderNumber}",
        paymentFailureBody: "We were unable to verify your payment for order {orderNumber}. Please check details, try again, or contact support.",
        feedbackSubject: "We'd love your feedback! - Order {orderNumber}",
        feedbackBody: "How did you like your books and our service? Please share a review on the store!",
        newsletterWelcomeSubject: "Welcome to Our Newsletter!",
        newsletterWelcomeBody: "Thank you for subscribing! You are on our list, we will inform you about our rare books and updates.",
        connectWelcomeSubject: "Thank you for connecting with us!",
        connectWelcomeBody: "You are on our list, we will inform you. We'll be in touch shortly!",
      }
    });
    console.log("Successfully seeded Settings collection!");

    console.log("\n===========================================");
    console.log("✅ SEEDING COMPLETED SUCCESSFULLY!");
    console.log("===========================================");
    console.log(`✓ ${insertedCategories.length} Categories`);
    console.log(`✓ ${insertedAuthors.length} Authors`);
    console.log(`✓ ${insertedBooks.length} Books`);
    console.log(`✓ ${insertedUsers.length} Users`);
    console.log(`✓ ${insertedCoupons.length} Coupons`);
    console.log(`✓ Newsletter & Notifications Seeded`);
    console.log(`✓ Settings Configured`);
    console.log("===========================================\n");
  } catch (error) {
    console.error("❌ Seeding error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
