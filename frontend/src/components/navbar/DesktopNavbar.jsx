import NavLinks from "./NavLinks";

const DesktopNavbar = () => {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      <NavLinks />
    </nav>
  );
};

export default DesktopNavbar;