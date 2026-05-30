import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";

import BookDetailsContent from "../../components/books/BookDetailsContent";
import PageLoader from "../../components/loaders/PageLoader";

const BookDetails = () => {

  const { id } = useParams();

  const [book, setBook] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchBook =
      async () => {

        try {

          const response =
            await axiosInstance.get(
              `/books/${id}`
            );

          setBook(
            response.data
          );

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchBook();

  }, [id]);

  if (loading) {
    return <PageLoader label="Loading Book Details" />;
  }

  return (
    <BookDetailsContent
      book={book}
    />
  );
};

export default BookDetails;