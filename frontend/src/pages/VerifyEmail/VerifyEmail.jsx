import { useEffect } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";

const VerifyEmail = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail =
      async () => {
        try {
          const response =
            await axiosInstance.get(
              `/auth/verify-email/${token}`
            );

          toast.success(
            response.data.message
          );

          navigate("/login");
        } catch (error) {
          toast.error(
            error.response?.data
              ?.message ||
              "Verification failed"
          );
        }
      };

    verifyEmail();
  }, []);

  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <h1 className="text-2xl font-bold text-[var(--color-primary)]">
        Verifying Email...
      </h1>
    </div>
  );
};

export default VerifyEmail;