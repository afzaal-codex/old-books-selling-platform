import { createContext, useContext, useState } from "react";

const SendGiftContext = createContext();

export const SendGiftProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openGiftModal  = () => setIsOpen(true);
  const closeGiftModal = () => setIsOpen(false);

  return (
    <SendGiftContext.Provider value={{ isOpen, openGiftModal, closeGiftModal }}>
      {children}
    </SendGiftContext.Provider>
  );
};

export const useSendGift = () => useContext(SendGiftContext);
