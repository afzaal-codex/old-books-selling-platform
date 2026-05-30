const validateEmail = (
  email
) => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};



const validatePassword = (
  password
) => {
  return password.length >= 6;
};



const validatePhone = (
  phone
) => {
  const phoneRegex =
    /^[0-9]{11}$/;

  return phoneRegex.test(phone);
};



const validateRequiredFields = (
  body,
  fields
) => {
  const missingFields = [];

  fields.forEach((field) => {
    if (!body[field]) {
      missingFields.push(field);
    }
  });

  return missingFields;
};

export {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequiredFields,
};