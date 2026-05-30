import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";

const ReviewSection = ({
  bookId,
}) => {

  const navigate =
    useNavigate();

  const token =
    localStorage.getItem("token");

  const [reviews,
    setReviews] =
    useState([]);

  const [rating,
    setRating] =
    useState(5);

  const [comment,
    setComment] =
    useState("");

  /* FETCH */

  useEffect(() => {

    const fetchReviews =
      async () => {

        try {

          const res =
            await axiosInstance.get(
              `/reviews/${bookId}`
            );

          setReviews(
            res.data.reviews
          );

        } catch (error) {}
      };

    fetchReviews();

  }, [bookId]);

  /* SUBMIT */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!token) {

        toast.error(
          "Please login first"
        );

        navigate("/login");

        return;
      }

      try {

        const res =
          await axiosInstance.post(
            "/reviews",
            {
              bookId,
              rating,
              comment,
            }
          );

        toast.success(
          "Review added"
        );

        setReviews((prev) => [
          res.data.review,
          ...prev,
        ]);

        setComment("");

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message
        );
      }
    };

  return (
    <div className="space-y-10">
      {/* FORM */}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-5 rounded-3xl border border-gray-200 bg-white p-8"
      >
        <h2 className="text-3xl font-bold">
          Write Review
        </h2>

        <select
          value={rating}
          onChange={(e) =>
            setRating(
              e.target.value
            )
          }
          className="w-full rounded-2xl border border-gray-200 px-5 py-4"
        >
          <option value="5">
            ⭐⭐⭐⭐⭐
          </option>

          <option value="4">
            ⭐⭐⭐⭐
          </option>

          <option value="3">
            ⭐⭐⭐
          </option>

          <option value="2">
            ⭐⭐
          </option>

          <option value="1">
            ⭐
          </option>
        </select>

        <textarea
          rows="5"
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
          placeholder="Write review..."
          className="w-full rounded-2xl border border-gray-200 px-5 py-4"
        />

        <button className="rounded-2xl bg-[var(--color-primary)] px-8 py-4 font-semibold text-white">
          Submit Review
        </button>
      </form>

      {/* REVIEWS */}

      <div className="space-y-5">
        {reviews.map(
          (review) => (
            <div
              key={review._id}
              className="rounded-3xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  {
                    review.user
                      ?.name
                  }
                </h3>

                <span className="text-yellow-500">
                  {"⭐".repeat(
                    review.rating
                  )}
                </span>
              </div>

              <p className="text-gray-600">
                {
                  review.comment
                }
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ReviewSection;