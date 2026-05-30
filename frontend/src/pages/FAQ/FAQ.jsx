import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      q: "How does BookWorld assess the condition of pre-loved books?",
      a: "Sellers assign condition scores to each book (e.g., 'Like New', 'Good', 'Acceptable'). We display condition notes and pictures to ensure transparency. If a book doesn't match the description, you can report it within 3 days of delivery.",
    },
    {
      q: "What payment methods are supported on the platform?",
      a: "We support JazzCash, EasyPaisa, and Bank Transfers. You can upload your payment receipt/screenshot and transaction ID during the checkout process. Our admin team verifies payments manually within 2-4 hours.",
    },
    {
      q: "Can I cancel my book order after purchase?",
      a: "Yes, you can request order cancellation directly from your Orders dashboard before the admin team verifies and approves the order. Once approved/shipped, cancellations are not permitted.",
    },
    {
      q: "How do shipping charges work?",
      a: "Standard delivery charges are set by the store. They are computed dynamically based on CMS configurations. If delivery configurations do not specify your region, a flat rate of Rs. 150 is applied.",
    },
    {
      q: "How can I sell my old books on BookWorld?",
      a: "Once registered, navigate to the seller dashboard (or contact admin for listing permissions if applicable) to upload your books' photos, author information, categories, set prices, and list them.",
    },
    {
      q: "What happens if my order gets rejected or cancelled?",
      a: "If the payment verification fails, or if a book is out of stock, your payment will be refunded to your original payment account. You will receive real-time notifications about the cancellation and refund details.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-12 bg-[var(--color-bg)] text-white pb-16 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Frequently Asked Questions</h1>
        <p className="text-sm text-gray-400">Everything you need to know about purchasing and selling old books on BookWorld.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-black/25 transition-colors"
              >
                <div className="flex items-center gap-4 pr-4">
                  <HelpCircle className="text-[var(--color-primary)] w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold text-white text-base md:text-lg">{faq.q}</span>
                </div>
                <ChevronDown
                  className={`text-gray-400 w-5 h-5 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-[var(--color-primary)]" : ""
                  }`}
                />
              </button>
              
              {isOpen && (
                <div className="p-6 pt-0 border-t border-[var(--color-border)]/50 bg-black/10 text-sm text-gray-300 leading-relaxed animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
