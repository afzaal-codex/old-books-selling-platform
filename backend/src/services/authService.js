import jwt from "jsonwebtoken";

const generateAuthToken = (
  payload
) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

const verifyAuthToken = (
  token
) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};

export {
  generateAuthToken,
  verifyAuthToken,
};