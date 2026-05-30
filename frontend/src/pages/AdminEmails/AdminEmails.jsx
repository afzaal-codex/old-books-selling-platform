import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, updateSettingsAction } from "../../store/slices/cmsSlice";
import toast from "react-hot-toast";
import { Save, Mail, Info } from "lucide-react";

const AdminEmails = () => {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector((state) => state.cms);

  // Email subject and body template states
  const [orderConfirmationSubject, setOrderConfirmationSubject] = useState("");
  const [orderConfirmationBody, setOrderConfirmationBody] = useState("");
  const [orderUpdateSubject, setOrderUpdateSubject] = useState("");
  const [orderUpdateBody, setOrderUpdateBody] = useState("");
  const [paymentFailureSubject, setPaymentFailureSubject] = useState("");
  const [paymentFailureBody, setPaymentFailureBody] = useState("");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackBody, setFeedbackBody] = useState("");
  const [newsletterWelcomeSubject, setNewsletterWelcomeSubject] = useState("");
  const [newsletterWelcomeBody, setNewsletterWelcomeBody] = useState("");
  const [connectWelcomeSubject, setConnectWelcomeSubject] = useState("");
  const [connectWelcomeBody, setConnectWelcomeBody] = useState("");

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Sync state with settings
  useEffect(() => {
    if (settings && settings.emailTemplates) {
      const templates = settings.emailTemplates;
      setOrderConfirmationSubject(templates.orderConfirmationSubject || "Order Confirmed - {orderNumber}");
      setOrderConfirmationBody(templates.orderConfirmationBody || "Thank you for shopping with us! Your order has been received and is being processed.");
      setOrderUpdateSubject(templates.orderUpdateSubject || "Order Update - {orderNumber} is now {orderStatus}");
      setOrderUpdateBody(templates.orderUpdateBody || "We wanted to let you know that the status of your order {orderNumber} has been updated to {orderStatus}.");
      setPaymentFailureSubject(templates.paymentFailureSubject || "Payment Failed - Order {orderNumber}");
      setPaymentFailureBody(templates.paymentFailureBody || "We were unable to verify your payment for order {orderNumber}. Please check details, try again, or contact support.");
      setFeedbackSubject(templates.feedbackSubject || "We'd love your feedback! - Order {orderNumber}");
      setFeedbackBody(templates.feedbackBody || "How did you like your books and our service? Please share a review on the store!");
      setNewsletterWelcomeSubject(templates.newsletterWelcomeSubject || "Welcome to Our Newsletter!");
      setNewsletterWelcomeBody(templates.newsletterWelcomeBody || "Thank you for subscribing! You are on our list, we will inform you about our rare books and updates.");
      setConnectWelcomeSubject(templates.connectWelcomeSubject || "Thank you for connecting with us!");
      setConnectWelcomeBody(templates.connectWelcomeBody || "You are on our list, we will inform you. We'll be in touch shortly!");
    }
  }, [settings]);

  const handleSaveEmails = async (e) => {
    e.preventDefault();
    const updatedSettings = {
      ...settings,
      emailTemplates: {
        orderConfirmationSubject,
        orderConfirmationBody,
        orderUpdateSubject,
        orderUpdateBody,
        paymentFailureSubject,
        paymentFailureBody,
        feedbackSubject,
        feedbackBody,
        newsletterWelcomeSubject,
        newsletterWelcomeBody,
        connectWelcomeSubject,
        connectWelcomeBody,
      },
    };

    try {
      await dispatch(updateSettingsAction(updatedSettings)).unwrap();
      toast.success("Email templates updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update email templates");
    }
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
        <h1 className="text-3xl font-extrabold text-[var(--color-primary)] flex items-center gap-2">
          <Mail className="text-[var(--color-primary)]" />
          Transactional Email Configurations
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Configure default Subjects and Body Content for system-generated emails sent to customers.
        </p>
      </div>

      {/* HELPER BOX */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex gap-4 text-xs text-gray-300">
        <Info className="text-[var(--color-primary)] shrink-0 mt-0.5" size={16} />
        <div className="space-y-1">
          <span className="font-bold text-white block">Template Variables Info:</span>
          <p>You can use the following placeholder variables inside email subjects or bodies. They will be automatically replaced with the actual order parameters when sending:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400 font-mono">
            <li><span className="text-[var(--color-primary)]">{`{orderNumber}`}</span> - Unique order code (e.g. ORD-2026-000001)</li>
            <li><span className="text-[var(--color-primary)]">{`{customerName}`}</span> - Recipient's shipping name</li>
            <li><span className="text-[var(--color-primary)]">{`{orderStatus}`}</span> - Active status (e.g. Shipped, Processing)</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSaveEmails} className="space-y-8">
        {/* Order Placement Confirmation */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
          <h3 className="font-bold text-lg text-[var(--color-primary)] border-b border-neutral-900 pb-3 flex items-center gap-2">
            1. New Order Confirmation Email
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Subject</label>
              <input
                type="text"
                required
                value={orderConfirmationSubject}
                onChange={(e) => setOrderConfirmationSubject(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Body Text</label>
              <textarea
                required
                rows={4}
                value={orderConfirmationBody}
                onChange={(e) => setOrderConfirmationBody(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-4 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Order Status Updates */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
          <h3 className="font-bold text-lg text-[var(--color-primary)] border-b border-neutral-900 pb-3 flex items-center gap-2">
            2. Order Status Update Email
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Subject</label>
              <input
                type="text"
                required
                value={orderUpdateSubject}
                onChange={(e) => setOrderUpdateSubject(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Body Text</label>
              <textarea
                required
                rows={4}
                value={orderUpdateBody}
                onChange={(e) => setOrderUpdateBody(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-4 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Payment Verification Failure */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
          <h3 className="font-bold text-lg text-[var(--color-primary)] border-b border-neutral-900 pb-3 flex items-center gap-2">
            3. Payment Failure Email
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Subject</label>
              <input
                type="text"
                required
                value={paymentFailureSubject}
                onChange={(e) => setPaymentFailureSubject(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Body Text</label>
              <textarea
                required
                rows={4}
                value={paymentFailureBody}
                onChange={(e) => setPaymentFailureBody(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-4 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Order Delivered Feedback */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
          <h3 className="font-bold text-lg text-[var(--color-primary)] border-b border-neutral-900 pb-3 flex items-center gap-2">
            4. Order Delivered Feedback Email
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Subject</label>
              <input
                type="text"
                required
                value={feedbackSubject}
                onChange={(e) => setFeedbackSubject(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Body Text</label>
              <textarea
                required
                rows={4}
                value={feedbackBody}
                onChange={(e) => setFeedbackBody(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-4 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Newsletter Welcome Email */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
          <h3 className="font-bold text-lg text-[var(--color-primary)] border-b border-neutral-900 pb-3 flex items-center gap-2">
            5. Newsletter Welcome Auto-Response Email
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Subject</label>
              <input
                type="text"
                required
                value={newsletterWelcomeSubject}
                onChange={(e) => setNewsletterWelcomeSubject(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Body Text</label>
              <textarea
                required
                rows={4}
                value={newsletterWelcomeBody}
                onChange={(e) => setNewsletterWelcomeBody(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-4 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Connect Welcome Email */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
          <h3 className="font-bold text-lg text-[var(--color-primary)] border-b border-neutral-900 pb-3 flex items-center gap-2">
            6. Connect Form Welcome Auto-Response Email
          </h3>
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Subject</label>
              <input
                type="text"
                required
                value={connectWelcomeSubject}
                onChange={(e) => setConnectWelcomeSubject(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block">Email Body Text</label>
              <textarea
                required
                rows={4}
                value={connectWelcomeBody}
                onChange={(e) => setConnectWelcomeBody(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-4 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* SAVE SUBMIT BUTTON */}
        <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] text-black font-extrabold px-8 py-4 hover:opacity-90 transition cursor-pointer shadow-lg text-sm"
          >
            <Save size={18} /> Save Email Templates
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEmails;
