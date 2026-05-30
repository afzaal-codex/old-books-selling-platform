const validateRequiredFields = (
  fields
) => {
  return (req, res, next) => {
    const missingFields = [];

    fields.forEach((field) => {
      if (
        !req.body[field] ||
        req.body[field] === ""
      ) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      res.status(400);

      throw new Error(
        `Missing required fields: ${missingFields.join(
          ", "
        )}`
      );
    }

    next();
  };
};



const validateEmail = (
  req,
  res,
  next
) => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    req.body.email &&
    !emailRegex.test(req.body.email)
  ) {
    res.status(400);

    throw new Error(
      "Invalid email address"
    );
  }

  next();
};



const validatePassword = (
  req,
  res,
  next
) => {
  const password =
    req.body.password;

  if (password && password.length < 6) {
    res.status(400);

    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  next();
};

export {
  validateRequiredFields,
  validateEmail,
  validatePassword,
};