import { Link } from "react-router-dom";
import companyData from "../../data/companyData";

const Logo = () => {
  const companyName = companyData.companyName || companyData.name || "BookWorld";

  return (
    <Link
      to="/"
      className="inline-flex items-center"
      style={{ textDecoration: "none", outline: "none", boxShadow: "none" }}
    >
      {companyData.logo ? (
        <img
          src={companyData.logo}
          alt={companyName}
          data-brand-logo="nav"
          className="brand-logo h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0"
          style={{ outline: "none", boxShadow: "none" }}
        />
      ) : (
        <div
          className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full text-lg sm:text-xl font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #c8860a, #f5c842)",
            outline: "none",
            boxShadow: "none",
            border: "none",
          }}
        >
          {companyName.charAt(0)}
        </div>
      )}
    </Link>
  );
};

export default Logo;
