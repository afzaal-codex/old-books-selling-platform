const sendSMS = async ({
  phone,
  message,
}) => {
  console.log(
    `SMS sent to ${phone}: ${message}`
  );

  return {
    success: true,
  };
};

export default sendSMS;