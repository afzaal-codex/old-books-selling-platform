import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

const SeoHead = () => {
  const { settings } = useSelector((state) => state.cms);
  const seo = settings?.seo || {};

  return (
    <Helmet>
      <title>{seo.title || "BookCorner"}</title>
      <meta name="description" content={seo.description || "Online Old Book Store"} />
      <meta name="keywords" content={seo.keywords || "old books, used books, bookstore"} />
    </Helmet>
  );
};

export default SeoHead;
