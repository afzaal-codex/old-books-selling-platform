import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/navbar/Header";
import Footer from "../components/footer/Footer";
import { RequestBookProvider } from "../context/RequestBookContext";
import RequestBookModal from "../components/navbar/RequestBookModal";
import { SendGiftProvider } from "../context/SendGiftContext";
import SendGiftModal from "../components/navbar/SendGiftModal";
import { useSendGift } from "../context/SendGiftContext";
import FloatingWhatsApp from "../components/common/FloatingWhatsApp";

/* ─── Inner wrapper so useSendGift can be used inside provider ─ */
const LayoutInner = () => {
  const { isOpen, closeGiftModal } = useSendGift();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)] pb-20 md:pb-0">
        {/* =========================
            WEBSITE HEADER
        ========================= */}
        <Header />

        {/* =========================
            MAIN WEBSITE CONTENT
        ========================= */}
        <main className="flex-1">
          {isHome ? (
            <Outlet />
          ) : (
            <div className="container-custom py-6">
              <Outlet />
            </div>
          )}
        </main>

        {/* =========================
            WEBSITE FOOTER
        ========================= */}
        <Footer />
      </div>
      <RequestBookModal />
      <SendGiftModal isOpen={isOpen} onClose={closeGiftModal} />
      <FloatingWhatsApp />
    </>
  );
};

const MainLayout = () => {
  return (
    <RequestBookProvider>
      <SendGiftProvider>
        <LayoutInner />
      </SendGiftProvider>
    </RequestBookProvider>
  );
};

export default MainLayout;
