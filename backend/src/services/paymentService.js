const calculateDeliveryCharges =
  (city, settings) => {
    if (
      settings.deliveryCharges &&
      settings.deliveryCharges.has(city)
    ) {
      return settings.deliveryCharges.get(
        city
      );
    }

    return 0;
  };

const calculateOrderTotal = ({
  subtotal,
  deliveryCharges,
  couponDiscount = 0,
}) => {
  return (
    subtotal +
    deliveryCharges -
    couponDiscount
  );
};

export {
  calculateDeliveryCharges,
  calculateOrderTotal,
};