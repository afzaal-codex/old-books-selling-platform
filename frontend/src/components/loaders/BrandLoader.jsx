import companyData from "../../data/companyData";

const BrandLoader = ({
  label = "Loading...",
  fullscreen = false,
  startup = false,
}) => {
  return (
    <div className={fullscreen ? "brand-loader-screen" : "brand-loader-wrap"}>
      <div className={startup ? "brand-loader brand-loader--startup" : "brand-loader"}>
        <img
          src={companyData.logo}
          alt={companyData.companyName}
          className="brand-loader__logo"
        />
        {!startup && (
          <>
            <span className="brand-loader__ring" />
            <span className="brand-loader__dot" />
          </>
        )}
      </div>
      {label && <p className="brand-loader__label">{label}</p>}
    </div>
  );
};

export default BrandLoader;
