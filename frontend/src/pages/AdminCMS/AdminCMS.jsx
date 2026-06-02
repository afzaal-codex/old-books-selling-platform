import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, updateSettingsAction } from "../../store/slices/cmsSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchBooks } from "../../store/slices/bookSlice";
import toast from "react-hot-toast";
import { Save, Settings, Info, CreditCard, Truck, HelpCircle, Plus, Trash2, Sparkles, BookOpen, Search, Lock } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import ButtonLoader from "../../components/loaders/ButtonLoader";
import { useSearchParams } from "react-router-dom";

const SECONDARY_NAV_OPTIONS = [
  { key: "featuredBooks", label: "Featured Books", query: "featured=true" },
  { key: "bestSeller", label: "Best Sellers", query: "bestseller=true" },
  { key: "highDiscount", label: "High Discounts", query: "highDiscount=true" },
  { key: "trendingThisWeek", label: "Trending This Week", query: "trending=true" },
  { key: "newReleases", label: "New Treasures", query: "newRelease=true" },
  { key: "offersThisWeek", label: "Offers This Week", query: "offersThisWeek=true" },
  { key: "antiqueBooks", label: "Antique Books", query: "antique=true" },
  { key: "signedBooks", label: "Signed Books", query: "signed=true" },
  { key: "vintageFinds", label: "Vintage Finds", query: "vintage=true" },
  { key: "recommended", label: "Recommended", query: "recommended=true" },
];

const AdminCMS = () => {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector((state) => state.cms);
  const { categories } = useSelector((state) => state.categories);
  const { books } = useSelector((state) => state.books);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "contact";
  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // Hero showcase fields state
  const [heroCategory, setHeroCategory] = useState("");
  const [heroBooks, setHeroBooks] = useState([]);
  const [heroButton1Text, setHeroButton1Text] = useState("SELL YOUR BOOK");
  const [heroButton1Link, setHeroButton1Link] = useState("/sell-book");
  const [heroButton2Text, setHeroButton2Text] = useState("CHOOSE FROM US");
  const [heroButton2Link, setHeroButton2Link] = useState("/books");
  const [heroPrimaryLine, setHeroPrimaryLine] = useState("Where Every Page\u00A0Whispers History.");
  const [heroSecondaryLine, setHeroSecondaryLine] = useState("Rare Volumes. Timeless\u00A0Souls.");

  // Spotlight Campaign fields state
  const [promoTitle, setPromoTitle] = useState("");
  const [promoSlogan, setPromoSlogan] = useState("");
  const [promoImage, setPromoImage] = useState("");
  const [promoDiscountValue, setPromoDiscountValue] = useState(0);
  const [promoActive, setPromoActive] = useState(false);
  const [promoButtonText, setPromoButtonText] = useState("Avail This Offer");
  const [promoButtonLink, setPromoButtonLink] = useState("/offers");

  // Promo Banner fields state
  const [pbActive, setPbActive] = useState(true);
  const [pbTagline, setPbTagline] = useState("✦ LIMITED TIME OFFER ✦");
  const [pbHeadline, setPbHeadline] = useState("Enjoy an Exclusive");
  const [pbDiscountValue, setPbDiscountValue] = useState(40);
  const [pbSubCopy, setPbSubCopy] = useState("On all rare & collectible editions — this weekend only");
  const [pbButtonText, setPbButtonText] = useState("SHOP NOW");
  const [pbButtonLink, setPbButtonLink] = useState("/offers");
  const [pbPromoCode, setPbPromoCode] = useState("RARE40");
  const [pbBgImage, setPbBgImage] = useState("");
  const [pbCardImage, setPbCardImage] = useState("");
  const [pbEndsAt, setPbEndsAt] = useState("");
  const [pbDiscountBooks, setPbDiscountBooks] = useState([]);

  // Fields state
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");

  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [youtube, setYoutube] = useState("");

  const [jcNumber, setJcNumber] = useState("");
  const [jcTitle, setJcTitle] = useState("");

  const [epNumber, setEpNumber] = useState("");
  const [epTitle, setEpTitle] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountTitle, setBankAccountTitle] = useState("");

  // Delivery Charges map editing
  const [deliveryCharges, setDeliveryCharges] = useState({});
  const [useFlatDeliveryRate, setUseFlatDeliveryRate] = useState(false);
  const [flatDeliveryRate, setFlatDeliveryRate] = useState(150);
  const [newCity, setNewCity] = useState("");
  const [newRate, setNewRate] = useState("");

  // Homepage sections visibility states
  const [offersThisWeekSec, setOffersThisWeekSec] = useState(true);
  const [featuredBooksSec, setFeaturedBooksSec] = useState(true);
  const [trendingAuthorsSec, setTrendingAuthorsSec] = useState(true);
  const [trendingCategoriesSec, setTrendingCategoriesSec] = useState(true);
  const [newReleasesSec, setNewReleasesSec] = useState(true);
  const [bestSellerSec, setBestSellerSec] = useState(true);
  const [highDiscountSec, setHighDiscountSec] = useState(true);
  const [antiqueBooksSec, setAntiqueBooksSec] = useState(true);
  const [signedBooksSec, setSignedBooksSec] = useState(true);
  const [vintageFindsSec, setVintageFindsSec] = useState(true);
  const [showStock, setShowStock] = useState(true);
  const [secondaryNav, setSecondaryNav] = useState({
    featuredBooks: true,
    bestSeller: true,
    highDiscount: true,
    trendingThisWeek: false,
    newReleases: false,
    offersThisWeek: false,
    antiqueBooks: false,
    signedBooks: false,
    vintageFinds: false,
    recommended: false,
  });

  // Discount strip states
  const [stripText, setStripText] = useState("");
  const [stripOfferContent, setStripOfferContent] = useState("");
  const [stripBgColor, setStripBgColor] = useState("#c8860a");
  const [stripTextColor, setStripTextColor] = useState("#ffffff");
  const [stripLabel, setStripLabel] = useState("");
  const [stripAnnouncement, setStripAnnouncement] = useState("");
  const [stripActive, setStripActive] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [loginEyebrow, setLoginEyebrow] = useState("");
  const [loginTitle, setLoginTitle] = useState("");
  const [loginSubtitle, setLoginSubtitle] = useState("");

  // Connect Section fields state
  const [connectEyebrow, setConnectEyebrow] = useState("The Old Shelf · Newsletter");
  const [connectHeading, setConnectHeading] = useState("Stay Within the Pages");
  const [connectHeadingEm, setConnectHeadingEm] = useState("the Pages");
  const [connectDescription, setConnectDescription] = useState("Rare arrivals, weekly curations & exclusive offers — delivered quietly to your inbox like a letter from a distant library.");
  const [connectBgImage, setConnectBgImage] = useState("");
  const [connectCardImage, setConnectCardImage] = useState("");
  const [connectButtonText, setConnectButtonText] = useState("Connect");
  const [adminOtp, setAdminOtp] = useState("");
  const [adminMatchNumber, setAdminMatchNumber] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (file, setter, label) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    const toastId = toast.loading(`Uploading ${label}...`);

    try {
      const response = await axiosInstance.post("/cms/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setter(response.data.url);
      toast.success(`${label} uploaded successfully!`, { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to upload ${label}`, { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchCategories());
    dispatch(fetchBooks({ limit: 1000 }));
  }, [dispatch]);

  // Sync state with settings
  useEffect(() => {
    if (settings) {
      setSupportEmail(settings.supportEmail || "");
      setSupportPhone(settings.supportPhone || "");

      setFacebook(settings.socialLinks?.facebook || "");
      setInstagram(settings.socialLinks?.instagram || "");
      setWhatsapp(settings.socialLinks?.whatsapp || "");
      setWhatsappMessage(settings.socialLinks?.whatsappMessage || "");
      setYoutube(settings.socialLinks?.youtube || "");

      setJcNumber(settings.paymentMethods?.jazzcash?.number || "");
      setJcTitle(settings.paymentMethods?.jazzcash?.accountTitle || "");

      setEpNumber(settings.paymentMethods?.easypaisa?.number || "");
      setEpTitle(settings.paymentMethods?.easypaisa?.accountTitle || "");

      setBankName(settings.paymentMethods?.bankTransfer?.bankName || "");
      setBankAccountNumber(settings.paymentMethods?.bankTransfer?.accountNumber || "");
      setBankAccountTitle(settings.paymentMethods?.bankTransfer?.accountTitle || "");

      setDeliveryCharges(settings.deliveryCharges || {});
      setUseFlatDeliveryRate(settings.useFlatDeliveryRate || false);
      setFlatDeliveryRate(settings.flatDeliveryRate || 150);

      const hp = settings.homepageSections || {};
      setOffersThisWeekSec(hp.offersThisWeek !== false);
      setFeaturedBooksSec(hp.featuredBooks !== false);
      setTrendingAuthorsSec(hp.trendingAuthors !== false);
      setTrendingCategoriesSec(hp.trendingCategories !== false);
      setNewReleasesSec(hp.newReleases !== false);
      setBestSellerSec(hp.bestSeller !== false);
      setHighDiscountSec(hp.highDiscount !== false);
      setAntiqueBooksSec(hp.antiqueBooks !== false);
      setSignedBooksSec(hp.signedBooks !== false);
      setVintageFindsSec(hp.vintageFinds !== false);

      const sn = settings.secondaryNav || {};
      setSecondaryNav((prev) => ({
        ...prev,
        ...Object.fromEntries(
          SECONDARY_NAV_OPTIONS.map((option) => [
            option.key,
            sn[option.key] !== undefined ? sn[option.key] !== false : prev[option.key],
          ])
        ),
      }));

      const ds = settings.discountStrip || {};
      setStripText(ds.text || "");
      setStripOfferContent(ds.offerContent || "");
      setStripBgColor(ds.backgroundColor || "#c8860a");
      setStripTextColor(ds.textColor || "#ffffff");
      setStripLabel(ds.promotionalLabel || "");
      setStripAnnouncement(ds.announcement || "");
      setStripActive(ds.isActive || false);

      const hs = settings.heroSection || {};
      setHeroCategory(hs.category?._id || hs.category || "");
      setHeroBooks(hs.books || []);
      setHeroButton1Text(hs.button1Text || "SELL YOUR BOOK");
      setHeroButton1Link(hs.button1Link || "/sell-book");
      setHeroButton2Text(hs.button2Text || "CHOOSE FROM US");
      setHeroButton2Link(hs.button2Link || "/books");
      setHeroPrimaryLine(hs.primaryLine || "Where Every Page\u00A0Whispers History.");
      setHeroSecondaryLine(hs.secondaryLine || "Rare Volumes. Timeless\u00A0Souls.");

      const pd = settings.promotionalDiscount || {};
      setPromoTitle(pd.title || "");
      setPromoSlogan(pd.slogan || "");
      setPromoImage(pd.image || "");
      setPromoDiscountValue(pd.discountValue || 0);
      setPromoActive(pd.isActive || false);
      setPromoButtonText(pd.buttonText || "Avail This Offer");
      setPromoButtonLink(pd.buttonLink || "/offers");

      const pb = settings.promoSection || {};
      setPbActive(pb.isActive !== false);
      setPbTagline(pb.tagline || "✦ LIMITED TIME OFFER ✦");
      setPbHeadline(pb.headline || "Enjoy an Exclusive");
      setPbDiscountValue(pb.discountValue !== undefined ? pb.discountValue : 40);
      setPbSubCopy(pb.subCopy || "On all rare & collectible editions — this weekend only");
      setPbButtonText(pb.buttonText || "SHOP NOW");
      setPbButtonLink(pb.buttonLink || "/books?promo=true");
      setPbPromoCode(pb.promoCode || "RARE40");
      setPbBgImage(pb.bgImage || "");
      setPbCardImage(pb.cardImage || "");
      if (pb.endsAt) {
        const d = new Date(pb.endsAt);
        const formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setPbEndsAt(formattedDate);
      } else {
        setPbEndsAt("");
      }
      setPbDiscountBooks(pb.discountBooks || []);

      const seo = settings.seo || {};
      setSeoTitle(seo.title || "BookWorld");
      setSeoDescription(seo.description || "Online Old Book Store");
      setSeoKeywords(seo.keywords || "");

      const login = settings.loginContent || {};
      setLoginEyebrow(login.eyebrow || "Bookstore Account");
      setLoginTitle(login.title || "Welcome Back");
      setLoginSubtitle(login.subtitle || "Login to continue your reading journey");

      const connectSec = settings.connectSection || {};
      setConnectEyebrow(connectSec.eyebrow || "The Old Shelf · Newsletter");
      setConnectHeading(connectSec.heading || "Stay Within the Pages");
      setConnectHeadingEm(connectSec.headingEm || "the Pages");
      setConnectDescription(connectSec.description || "Rare arrivals, weekly curations & exclusive offers — delivered quietly to your inbox like a letter from a distant library.");
      setConnectBgImage(connectSec.bgImage || "");
      setConnectCardImage(connectSec.cardImage || "");
      setConnectButtonText(connectSec.buttonText || "Connect");
      setShowStock(settings.showStock !== false);
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const updatedSettings = {
      supportEmail,
      supportPhone,
      showStock,
      socialLinks: { facebook, instagram, whatsapp, whatsappMessage, youtube },
      paymentMethods: {
        jazzcash: { number: jcNumber, accountTitle: jcTitle },
        easypaisa: { number: epNumber, accountTitle: epTitle },
        bankTransfer: { bankName, accountNumber: bankAccountNumber, accountTitle: bankAccountTitle },
      },
      deliveryCharges,
      useFlatDeliveryRate,
      flatDeliveryRate,
      homepageSections: {
        offersThisWeek: offersThisWeekSec,
        featuredBooks: featuredBooksSec,
        trendingAuthors: trendingAuthorsSec,
        trendingCategories: trendingCategoriesSec,
        newReleases: newReleasesSec,
        bestSeller: bestSellerSec,
        highDiscount: highDiscountSec,
        antiqueBooks: antiqueBooksSec,
        signedBooks: signedBooksSec,
        vintageFinds: vintageFindsSec,
      },
      secondaryNav,
      discountStrip: {
        text: stripText,
        offerContent: stripOfferContent,
        backgroundColor: stripBgColor,
        textColor: stripTextColor,
        promotionalLabel: stripLabel,
        announcement: stripAnnouncement,
        isActive: stripActive,
      },
      heroSection: {
        category: heroCategory || null,
        books: heroBooks.map((b) => b._id || b),
        button1Text: heroButton1Text,
        button1Link: heroButton1Link,
        button2Text: heroButton2Text,
        button2Link: heroButton2Link,
        primaryLine: heroPrimaryLine,
        secondaryLine: heroSecondaryLine,
      },
      seo: {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,
      },
      promotionalDiscount: {
        title: promoTitle,
        slogan: promoSlogan,
        image: promoImage,
        discountValue: Number(promoDiscountValue),
        isActive: promoActive,
        buttonText: promoButtonText,
        buttonLink: promoButtonLink,
      },
      promoSection: {
        isActive: pbActive,
        tagline: pbTagline,
        headline: pbHeadline,
        discountValue: Number(pbDiscountValue),
        subCopy: pbSubCopy,
        buttonText: pbButtonText,
        buttonLink: pbButtonLink,
        promoCode: pbPromoCode,
        bgImage: pbBgImage,
        cardImage: pbCardImage,
        endsAt: pbEndsAt ? new Date(pbEndsAt).toISOString() : null,
        discountBooks: pbDiscountBooks.map((b) => b._id || b),
      },
      loginContent: {
        eyebrow: loginEyebrow,
        title: loginTitle,
        subtitle: loginSubtitle,
      },
      connectSection: {
        eyebrow: connectEyebrow,
        heading: connectHeading,
        headingEm: connectHeadingEm,
        description: connectDescription,
        bgImage: connectBgImage,
        cardImage: connectCardImage,
        buttonText: connectButtonText,
      },
      adminOtp,
      adminMatchNumber,
    };

    try {
      await dispatch(updateSettingsAction(updatedSettings)).unwrap();
      toast.success("CMS configurations saved successfully!");
      setAdminOtp("");
      setAdminMatchNumber("");
    } catch (error) {
      toast.error(error.message || "Failed to update CMS settings");
    }
  };

  const handleRequestCmsOtp = async () => {
    try {
      const response = await axiosInstance.post("/cms/request-otp", { purpose: "cms-update" });
      setAdminMatchNumber(response.data.matchNumber || "");
      toast.success("OTP sent to admin email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleAddCityCharge = (e) => {
    e.preventDefault();
    if (!newCity.trim() || !newRate) return;

    const rateNum = Number(newRate);
    if (isNaN(rateNum) || rateNum < 0) {
      toast.error("Please enter a valid rate");
      return;
    }

    setDeliveryCharges((prev) => ({
      ...prev,
      [newCity.trim()]: rateNum,
    }));
    setNewCity("");
    setNewRate("");
    toast.success("Delivery charge mapping added!");
  };

  const handleRemoveCityCharge = (cityName) => {
    const updated = { ...deliveryCharges };
    delete updated[cityName];
    setDeliveryCharges(updated);
    toast.success(`Removed delivery mapping for ${cityName}`);
  };

  if (loading && !settings) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="border-b border-[var(--color-border)] pb-5">
        <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Book World Storefront CMS Configurations</h1>
        <p className="text-sm text-gray-400 mt-2">Manage contact support info, wallets, banking credentials, and delivery charges</p>
      </div>

      {/* SETTINGS NAV TABS */}
      <div className="flex gap-4 border-b border-[var(--color-border)] pb-3 text-xs font-bold uppercase overflow-x-auto scrollbar-hide">
        {[
          { id: "contact", label: "Contact Info", icon: Info },
          { id: "socials", label: "Social Links", icon: HelpCircle },
          { id: "gateways", label: "Payment Wallets", icon: CreditCard },
          { id: "delivery", label: "Shipping Rates", icon: Truck },
          { id: "homepage", label: "Homepage CMS", icon: Settings },
          { id: "secondaryNav", label: "Secondary Nav", icon: Settings },
          { id: "strip", label: "Discount Strip", icon: Sparkles },
          { id: "spotlight", label: "Spotlight Offer", icon: Sparkles },
          { id: "promobanner", label: "Promo Banner", icon: Sparkles },
          { id: "hero", label: "Hero Showcase", icon: BookOpen },
          { id: "seo", label: "SEO", icon: Search },
          { id: "login", label: "Login Text", icon: Lock },
          { id: "connect", label: "Connect Form", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-250"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* FORM BODY */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Tab 1: Contact info */}
        {activeTab === "contact" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Support Details</h3>
            <div className="grid gap-6 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300">Support Email *</label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">Support Phone / Help line *</label>
                <input
                  type="tel"
                  required
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Social Links */}
        {activeTab === "socials" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Social Network URLs</h3>
            <div className="grid gap-6 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300">Facebook Page URL</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">Instagram Handle URL</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">WhatsApp Direct Link / Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 923001234567 or full wa.me link"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">WhatsApp Pre-filled Chat Message</label>
                <textarea
                  placeholder="e.g. Hello BookWorld, I want to inquire about a book..."
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">YouTube Channel URL</label>
                <input
                  type="url"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Payment credentials */}
        {activeTab === "gateways" && (
          <div className="space-y-6 animate-fadeIn">
            {/* JazzCash & Easypaisa */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
              <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Mobile Wallets Credentials</h3>
              <div className="grid gap-6 md:grid-cols-2 text-sm">
                {/* JazzCash */}
                <div className="space-y-4 border border-neutral-850 p-4 rounded-2xl bg-neutral-950/40">
                  <span className="font-bold text-xs text-[var(--color-primary)]">JazzCash Account</span>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Account Title</label>
                    <input
                      type="text"
                      value={jcTitle}
                      onChange={(e) => setJcTitle(e.target.value)}
                      className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Wallet Mobile Number</label>
                    <input
                      type="text"
                      value={jcNumber}
                      onChange={(e) => setJcNumber(e.target.value)}
                      className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>

                {/* EasyPaisa */}
                <div className="space-y-4 border border-neutral-850 p-4 rounded-2xl bg-neutral-950/40">
                  <span className="font-bold text-xs text-[var(--color-primary)]">EasyPaisa Account</span>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Account Title</label>
                    <input
                      type="text"
                      value={epTitle}
                      onChange={(e) => setEpTitle(e.target.value)}
                      className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Wallet Mobile Number</label>
                    <input
                      type="text"
                      value={epNumber}
                      onChange={(e) => setEpNumber(e.target.value)}
                      className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank details */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
              <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Bank Account Wire Details</h3>
              <div className="grid gap-6 md:grid-cols-3 text-sm">
                <div className="space-y-2">
                  <label className="text-gray-300">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300">Account Title</label>
                  <input
                    type="text"
                    value={bankAccountTitle}
                    onChange={(e) => setBankAccountTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300">Account Number / IBAN</label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Delivery charges */}
        {activeTab === "delivery" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Global Flat Rate Card */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-4 shadow-md">
              <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3 flex items-center gap-2">
                <Truck size={18} className="text-[var(--color-primary)]" />
                Global Shipping Settings
              </h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useFlatDeliveryRate}
                    onChange={(e) => setUseFlatDeliveryRate(e.target.checked)}
                    className="w-5 h-5 rounded border-neutral-750 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-sm font-semibold text-gray-250">Use Flat Rate Delivery Charge for all cities</span>
                </label>

                {useFlatDeliveryRate && (
                  <div className="flex items-center gap-2 animate-fadeIn">
                    <span className="text-xs text-gray-400">Flat Rate (PKR):</span>
                    <input
                      type="number"
                      value={flatDeliveryRate}
                      onChange={(e) => setFlatDeliveryRate(Number(e.target.value))}
                      className="bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 outline-none text-xs text-white w-32"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* City-wise rates */}
            {!useFlatDeliveryRate ? (
              <div className="grid gap-8 md:grid-cols-3">
                {/* Create mapping */}
                <div className="md:col-span-1 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 h-fit space-y-4 shadow-md">
                  <h3 className="font-bold text-base text-[var(--color-primary)]">Add City Rate</h3>
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-400">City Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Islamabad"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 outline-none text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400">Rate (PKR) *</label>
                      <input
                        type="number"
                        placeholder="e.g. 200"
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                        className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 outline-none text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCityCharge}
                      className="w-full py-2.5 bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-xs"
                    >
                      <Plus size={14} /> Add City Charge
                    </button>
                  </div>
                </div>

                {/* List maps */}
                <div className="md:col-span-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-4 shadow-md">
                  <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Delivery Rate Map</h3>
                  {Object.keys(deliveryCharges).length === 0 ? (
                    <p className="text-gray-500 text-center py-6 text-xs">No city delivery charges defined yet. Default is 150 PKR.</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 max-h-64 overflow-y-auto pr-2">
                      {Object.entries(deliveryCharges).map(([cityName, rate]) => (
                        <div
                          key={cityName}
                          className="flex justify-between items-center bg-neutral-950/40 border border-neutral-900 p-3 rounded-xl text-xs"
                        >
                          <div>
                            <span className="font-semibold block text-gray-200">{cityName}</span>
                            <span className="text-[10px] text-[var(--color-primary)] font-bold">{rate} PKR</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCityCharge(cityName)}
                            className="p-1.5 hover:bg-red-950/20 text-red-550 rounded-lg hover:text-red-400 transition cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-8 text-center text-gray-400 text-xs">
                <Truck size={32} className="mx-auto mb-3 text-gray-600" />
                <p>Flat Rate Shipping is active. Orders to all cities will be charged a flat rate of <strong>{flatDeliveryRate} PKR</strong>.</p>
                <p className="text-[10px] text-gray-550 mt-1">To set custom city-wise rates, disable the flat rate option above.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Homepage CMS */}
        {activeTab === "homepage" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Homepage Sections Visibility</h3>
            <div className="grid gap-6 md:grid-cols-2 text-sm">
              {[
                { id: "offersThisWeek", label: "Offers This Week Section", val: offersThisWeekSec, setVal: setOffersThisWeekSec },
                { id: "featuredBooks", label: "Featured Books Section", val: featuredBooksSec, setVal: setFeaturedBooksSec },
                { id: "trendingAuthors", label: "Trending Authors Section", val: trendingAuthorsSec, setVal: setTrendingAuthorsSec },
                { id: "trendingCategories", label: "Trending Categories Section", val: trendingCategoriesSec, setVal: setTrendingCategoriesSec },
                { id: "newReleases", label: "New Treasures Section", val: newReleasesSec, setVal: setNewReleasesSec },
                { id: "bestSeller", label: "Best Sellers Section", val: bestSellerSec, setVal: setBestSellerSec },
                { id: "highDiscount", label: "High Discounts Section", val: highDiscountSec, setVal: setHighDiscountSec },
                { id: "antiqueBooks", label: "Antique Books Section", val: antiqueBooksSec, setVal: setAntiqueBooksSec },
                { id: "signedBooks", label: "Signed Books Section", val: signedBooksSec, setVal: setSignedBooksSec },
                { id: "vintageFinds", label: "Vintage Finds Section", val: vintageFindsSec, setVal: setVintageFindsSec },
              ].map((section) => (
                <div key={section.id} className="flex items-center justify-between p-4 bg-neutral-950/40 border border-neutral-900 rounded-2xl">
                  <div className="space-y-0.5">
                    <span className="font-semibold block text-gray-250">{section.label}</span>
                    <span className="text-[10px] text-gray-500">Toggle display on home storefront</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={section.val}
                    onChange={(e) => section.setVal(e.target.checked)}
                    className="w-5 h-5 rounded border-neutral-700 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                  />
                </div>
              ))}
              
              {/* Stock Status Check option */}
              <div className="flex items-center justify-between p-4 bg-neutral-950/40 border border-neutral-900 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="font-semibold block text-gray-250">Display Stock Status & Check</span>
                  <span className="text-[10px] text-gray-500">Show stock numbers and "In Stock" indicators to users</span>
                </div>
                <input
                  type="checkbox"
                  checked={showStock}
                  onChange={(e) => setShowStock(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-700 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "secondaryNav" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <div className="border-b border-neutral-900 pb-3">
              <h3 className="font-bold text-lg text-white">Secondary Nav Settings</h3>
              <p className="mt-1 text-xs text-gray-500">
                Choose which book flag links appear in the desktop secondary navigation. Categories, Authors, All Books, and Gift Card stay fixed.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              {SECONDARY_NAV_OPTIONS.map((option) => (
                <div key={option.key} className="flex items-center justify-between p-4 bg-neutral-950/40 border border-neutral-900 rounded-2xl">
                  <div className="space-y-0.5">
                    <span className="font-semibold block text-gray-250">{option.label}</span>
                    <span className="text-[10px] text-gray-500">Links to /books?{option.query}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={secondaryNav[option.key] !== false}
                    onChange={(e) => setSecondaryNav((prev) => ({ ...prev, [option.key]: e.target.checked }))}
                    className="w-5 h-5 rounded border-neutral-700 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Discount Strip */}
        {activeTab === "strip" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Discount Strip Configuration</h3>
            <div className="grid gap-6 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300">Strip Text (Offer announcements) *</label>
                <input
                  type="text"
                  required
                  value={stripText}
                  onChange={(e) => setStripText(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">Offer Content *</label>
                <input
                  type="text"
                  required
                  value={stripOfferContent}
                  onChange={(e) => setStripOfferContent(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">Promotional Label</label>
                <input
                  type="text"
                  value={stripLabel}
                  onChange={(e) => setStripLabel(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">Discount Announcement</label>
                <input
                  type="text"
                  value={stripAnnouncement}
                  onChange={(e) => setStripAnnouncement(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">Strip Background Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={stripBgColor}
                    onChange={(e) => setStripBgColor(e.target.value)}
                    className="w-12 h-12 bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={stripBgColor}
                    onChange={(e) => setStripBgColor(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">Strip Text Color</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={stripTextColor}
                    onChange={(e) => setStripTextColor(e.target.value)}
                    className="w-12 h-12 bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={stripTextColor}
                    onChange={(e) => setStripTextColor(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-950/40 border border-neutral-900 rounded-2xl md:col-span-2 mt-4">
                <div className="space-y-0.5">
                  <span className="font-semibold block text-gray-200">Active Status</span>
                  <span className="text-[10px] text-gray-500">Toggle whether the moving discount strip is visible on the storefront</span>
                </div>
                <input
                  type="checkbox"
                  checked={stripActive}
                  onChange={(e) => setStripActive(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-700 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6.5: Spotlight Offer */}
        {activeTab === "spotlight" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Timed Spotlight Campaign Configuration</h3>
            <div className="grid gap-6 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Campaign Title</label>
                <input
                  type="text"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. Eid Mubarak"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Campaign Slogan</label>
                <input
                  type="text"
                  value={promoSlogan}
                  onChange={(e) => setPromoSlogan(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. Special festive offers and rare finds"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Discount Value (Flat / %)</label>
                <input
                  type="number"
                  value={promoDiscountValue}
                  onChange={(e) => setPromoDiscountValue(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. 23"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block text-xs">Campaign Banner Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900">
                  {promoImage ? (
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-border)] flex-shrink-0 bg-neutral-900">
                      <img src={promoImage} alt="Campaign preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPromoImage("")}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold text-xs transition-opacity cursor-pointer border-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-800 flex items-center justify-center text-gray-500 text-xs flex-shrink-0 bg-neutral-900">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 w-full text-xs">
                    <input
                      type="file"
                      accept="image/*"
                      id="promo-image-upload"
                      onChange={(e) => handleImageUpload(e.target.files[0], setPromoImage, "Campaign Banner")}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="promo-image-upload"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-900 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : promoImage ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, JPEG or WEBP up to 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">CTA Button Text</label>
                <input
                  type="text"
                  value={promoButtonText}
                  onChange={(e) => setPromoButtonText(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. Avail This Offer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">CTA Button Link Location</label>
                <input
                  type="text"
                  value={promoButtonLink}
                  onChange={(e) => setPromoButtonLink(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. /offers"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-950/40 border border-neutral-900 rounded-2xl md:col-span-2 mt-4">
                <div className="space-y-0.5">
                  <span className="font-semibold block text-gray-200">Spotlight Visibility</span>
                  <span className="text-[10px] text-gray-500">Toggle whether this timed campaign modal pop-up is shown on storefront home page</span>
                </div>
                <input
                  type="checkbox"
                  checked={promoActive}
                  onChange={(e) => setPromoActive(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-700 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                />
              </div>

            </div>
          </div>
        )}

        {/* Tab 6.6: Promo Banner */}
        {activeTab === "promobanner" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Promo Banner Section Configuration</h3>
            <div className="grid gap-6 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Banner Tagline</label>
                <input
                  type="text"
                  value={pbTagline}
                  onChange={(e) => setPbTagline(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. ✦ LIMITED TIME OFFER ✦"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Banner Headline</label>
                <input
                  type="text"
                  value={pbHeadline}
                  onChange={(e) => setPbHeadline(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. Enjoy an Exclusive"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Discount Value (%)</label>
                <input
                  type="number"
                  value={pbDiscountValue}
                  onChange={(e) => setPbDiscountValue(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. 40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Sub Copy Description</label>
                <input
                  type="text"
                  value={pbSubCopy}
                  onChange={(e) => setPbSubCopy(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. On all rare & collectible editions — this weekend only"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Button Text</label>
                <input
                  type="text"
                  value={pbButtonText}
                  onChange={(e) => setPbButtonText(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. SHOP NOW"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Button Link Location</label>
                <input
                  type="text"
                  value={pbButtonLink}
                  onChange={(e) => setPbButtonLink(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. /books?promo=true"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Promo Code Coupon</label>
                <input
                  type="text"
                  value={pbPromoCode}
                  onChange={(e) => setPbPromoCode(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. RARE40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block text-xs">Promo Background Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900">
                  {pbBgImage ? (
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-border)] flex-shrink-0 bg-neutral-900">
                      <img src={pbBgImage} alt="Promo bg preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPbBgImage("")}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold text-xs transition-opacity cursor-pointer border-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-800 flex items-center justify-center text-gray-500 text-xs flex-shrink-0 bg-neutral-900">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 w-full text-xs">
                    <input
                      type="file"
                      accept="image/*"
                      id="pbbg-image-upload"
                      onChange={(e) => handleImageUpload(e.target.files[0], setPbBgImage, "Promo Background")}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="pbbg-image-upload"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-900 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : pbBgImage ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, JPEG or WEBP up to 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block text-xs">Promo Card Book Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900">
                  {pbCardImage ? (
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-border)] flex-shrink-0 bg-neutral-900">
                      <img src={pbCardImage} alt="Promo card preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPbCardImage("")}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold text-xs transition-opacity cursor-pointer border-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-800 flex items-center justify-center text-gray-500 text-xs flex-shrink-0 bg-neutral-900">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 w-full text-xs">
                    <input
                      type="file"
                      accept="image/*"
                      id="pbcard-image-upload"
                      onChange={(e) => handleImageUpload(e.target.files[0], setPbCardImage, "Promo Card Book")}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="pbcard-image-upload"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-900 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : pbCardImage ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, JPEG or WEBP up to 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Promo Offer Expiration (Ends At Date/Time) *</label>
                <input
                  type="datetime-local"
                  value={pbEndsAt}
                  onChange={(e) => setPbEndsAt(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] cursor-pointer text-xs"
                />
              </div>

              <div className="space-y-2 md:col-span-2 border-t border-neutral-900 pt-6 mt-2">
                <label className="text-gray-300 block font-semibold">Add Targeted Book to Promo Discount</label>
                <select
                  onChange={(e) => {
                    const bookId = e.target.value;
                    if (!bookId) return;
                    const selectedBook = books.find((b) => b._id === bookId);
                    if (selectedBook && !pbDiscountBooks.some((b) => b._id === bookId)) {
                      setPbDiscountBooks([...pbDiscountBooks, selectedBook]);
                    }
                    e.target.value = "";
                  }}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] cursor-pointer"
                >
                  <option value="">Choose a book to apply promo discount...</option>
                  {books
                    .filter((b) => !pbDiscountBooks.some((pbb) => pbb._id === b._id))
                    .map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title} - {b.author?.name || "Unknown Author"}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-3 mt-4 md:col-span-2">
                <h4 className="font-semibold text-gray-200">Selected Promotional Discount Books</h4>
                {pbDiscountBooks.length === 0 ? (
                  <p className="text-gray-500 text-center py-6 text-xs">No books targeted for this promotional discount yet. Use the dropdown above to add books.</p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {pbDiscountBooks.map((b, index) => (
                      <div
                        key={b._id || index}
                        className="flex items-center justify-between bg-neutral-950/40 border border-neutral-900 p-4 rounded-2xl text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={b.images?.[0] || b.cover || "https://placehold.co/100x150"}
                            alt={b.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div>
                            <span className="font-bold block text-gray-250 text-sm">{b.title}</span>
                            <span className="text-[10px] text-gray-500">by {b.author?.name || b.author || "Unknown Author"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPbDiscountBooks(pbDiscountBooks.filter((pbb) => pbb._id !== b._id));
                          }}
                          className="p-2 hover:bg-red-950/20 text-red-500 rounded-xl hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-950/40 border border-neutral-900 rounded-2xl md:col-span-2 mt-6">
                <div className="space-y-0.5">
                  <span className="font-semibold block text-gray-200">Banner Visibility</span>
                  <span className="text-[10px] text-gray-500">Toggle whether this promo banner is displayed on the storefront home page</span>
                </div>
                <input
                  type="checkbox"
                  checked={pbActive}
                  onChange={(e) => setPbActive(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-700 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Hero Showcase */}
        {activeTab === "hero" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Homepage Hero Showcase Configuration</h3>
            
            <div className="grid gap-6 md:grid-cols-2 text-sm border-b border-neutral-900 pb-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-gray-300 block font-semibold">Hero Primary Text Line</label>
                <input
                  type="text"
                  value={heroPrimaryLine}
                  onChange={(e) => setHeroPrimaryLine(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-gray-300 block font-semibold">Hero Secondary Text Line (Typewriter Animated)</label>
                <input
                  type="text"
                  value={heroSecondaryLine}
                  onChange={(e) => setHeroSecondaryLine(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-300 block font-semibold">Hero Action Button 1 Label</label>
                <input
                  type="text"
                  value={heroButton1Text}
                  onChange={(e) => setHeroButton1Text(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-300 block font-semibold">Hero Action Button 1 Link (Route/URL)</label>
                <input
                  type="text"
                  value={heroButton1Link}
                  onChange={(e) => setHeroButton1Link(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-300 block font-semibold">Hero Action Button 2 Label</label>
                <input
                  type="text"
                  value={heroButton2Text}
                  onChange={(e) => setHeroButton2Text(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-300 block font-semibold">Hero Action Button 2 Link (Route/URL)</label>
                <input
                  type="text"
                  value={heroButton2Link}
                  onChange={(e) => setHeroButton2Link(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-gray-300 block font-semibold">Filter Books by Category</label>
                  <select
                    value={heroCategory}
                    onChange={(e) => {
                      setHeroCategory(e.target.value);
                    }}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="">All Categories (No Filter)...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 block font-semibold">Add Book to Hero Showcase</label>
                  <select
                    onChange={(e) => {
                      const bookId = e.target.value;
                      if (!bookId) return;
                      const selectedBook = books.find((b) => b._id === bookId);
                      if (selectedBook && !heroBooks.some((b) => b._id === bookId)) {
                        setHeroBooks([...heroBooks, selectedBook]);
                      }
                      e.target.value = "";
                    }}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="">Choose a book to add...</option>
                    {books
                      .filter((b) => !heroCategory || b.category?._id === heroCategory || b.category === heroCategory)
                      .filter((b) => !heroBooks.some((hb) => hb._id === b._id))
                      .map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.title} - {b.author?.name || "Unknown Author"}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="font-semibold text-gray-200">Selected Showcase Books (Limit 5 Recommended)</h4>
                {heroBooks.length === 0 ? (
                  <p className="text-gray-500 text-center py-6 text-xs">No books added to the Hero Showcase. Add some from the selector above.</p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {heroBooks.map((b, index) => (
                      <div
                        key={b._id || index}
                        className="flex items-center justify-between bg-neutral-950/40 border border-neutral-900 p-4 rounded-2xl text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={b.images?.[0] || b.cover || "https://placehold.co/100x150"}
                            alt={b.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div>
                            <span className="font-bold block text-gray-250 text-sm">{b.title}</span>
                            <span className="text-[10px] text-gray-500">by {b.author?.name || b.author || "Unknown Author"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setHeroBooks(heroBooks.filter((hb) => hb._id !== b._id));
                          }}
                          className="p-2 hover:bg-red-950/20 text-red-500 rounded-xl hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">SEO Settings</h3>
            <div className="grid gap-6 text-sm">
              <div>
                <label className="text-gray-300">Meta Title</label>
                <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="text-gray-300">Meta Description</label>
                <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="text-gray-300">Keywords</label>
                <input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "login" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Login Page Text</h3>
            <div className="grid gap-6 md:grid-cols-3 text-sm">
              <div>
                <label className="text-gray-300">Small Heading</label>
                <input value={loginEyebrow} onChange={(e) => setLoginEyebrow(e.target.value)} className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="text-gray-300">Main Title</label>
                <input value={loginTitle} onChange={(e) => setLoginTitle(e.target.value)} className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="text-gray-300">Subtitle</label>
                <input value={loginSubtitle} onChange={(e) => setLoginSubtitle(e.target.value)} className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "connect" && (
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md animate-fadeIn">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3">Connect / Newsletter Form Settings</h3>
            <div className="grid gap-6 md:grid-cols-2 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Eyebrow Small Text</label>
                <input
                  value={connectEyebrow}
                  onChange={(e) => setConnectEyebrow(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. The Old Shelf · Newsletter"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Button Text</label>
                <input
                  value={connectButtonText}
                  onChange={(e) => setConnectButtonText(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. Connect"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Main Heading Text</label>
                <input
                  value={connectHeading}
                  onChange={(e) => setConnectHeading(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. Stay Within the Pages"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Emphasized Word / Sub-phrase (italicized in gold)</label>
                <input
                  value={connectHeadingEm}
                  onChange={(e) => setConnectHeadingEm(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  placeholder="e.g. the Pages"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-gray-300 font-semibold block">Description Copy</label>
                <textarea
                  value={connectDescription}
                  onChange={(e) => setConnectDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Enter newsletter description..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block text-xs">Section Background Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900">
                  {connectBgImage ? (
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-border)] flex-shrink-0 bg-neutral-900">
                      <img src={connectBgImage} alt="Connect bg preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setConnectBgImage("")}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold text-xs transition-opacity cursor-pointer border-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-800 flex items-center justify-center text-gray-500 text-xs flex-shrink-0 bg-neutral-900">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 w-full text-xs">
                    <input
                      type="file"
                      accept="image/*"
                      id="connectbg-image-upload"
                      onChange={(e) => handleImageUpload(e.target.files[0], setConnectBgImage, "Connect Background")}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="connectbg-image-upload"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-900 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : connectBgImage ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, JPEG or WEBP up to 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block text-xs">Left Side Book cover/Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900">
                  {connectCardImage ? (
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-border)] flex-shrink-0 bg-neutral-900">
                      <img src={connectCardImage} alt="Connect card preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setConnectCardImage("")}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold text-xs transition-opacity cursor-pointer border-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-800 flex items-center justify-center text-gray-500 text-xs flex-shrink-0 bg-neutral-900">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 w-full text-xs">
                    <input
                      type="file"
                      accept="image/*"
                      id="connectcard-image-upload"
                      onChange={(e) => handleImageUpload(e.target.files[0], setConnectCardImage, "Connect Card Image")}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="connectcard-image-upload"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-900 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : connectCardImage ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, JPEG or WEBP up to 5MB.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}


        {/* SAVE SUBMIT BUTTON */}
        <div className="grid gap-4 md:grid-cols-[1fr_auto] pt-4 border-t border-[var(--color-border)] items-center">
          <div className="grid gap-3 md:grid-cols-3 items-center">
            <input 
              placeholder="6 digit OTP" 
              value={adminOtp} 
              onChange={(e) => setAdminOtp(e.target.value)} 
              className="bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]" 
            />
            {adminMatchNumber ? (
              <div className="text-center bg-neutral-900 border border-[var(--color-border)] rounded-xl py-3 text-xs text-gray-450">
                Match Number: <strong className="text-[var(--color-primary)] text-lg ml-1">{adminMatchNumber}</strong>
              </div>
            ) : (
              <div className="text-center text-[10px] text-gray-500 bg-neutral-900/20 border border-neutral-900/50 rounded-xl py-3.5">
                Send OTP to see match no.
              </div>
            )}
            <button 
              type="button" 
              onClick={handleRequestCmsOtp} 
              className="rounded-2xl border border-[var(--color-primary)] text-[var(--color-primary)] font-extrabold px-5 py-3.5 hover:opacity-90 transition cursor-pointer text-sm"
            >
              Send OTP
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] text-black font-extrabold px-8 py-4 hover:opacity-90 transition cursor-pointer shadow-lg text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <ButtonLoader label="Saving..." /> : (<><Save size={18} /> Save Settings</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCMS;
