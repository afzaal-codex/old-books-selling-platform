import { createContext, useContext, useState } from "react";

const RequestBookContext = createContext();

export const RequestBookProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openRequestModal = () => setIsOpen(true);
  const closeRequestModal = () => setIsOpen(false);

  return (
    <RequestBookContext.Provider value={{ isOpen, openRequestModal, closeRequestModal }}>
      {children}
    </RequestBookContext.Provider>
  );
};

export const useRequestBook = () => useContext(RequestBookContext);
