const notFoundMiddleware = (
  req,
  res,
  next
) => {
  res.status(404);

  const error = new Error(
    `Route Not Found - ${req.originalUrl}`
  );

  next(error);
};

export default notFoundMiddleware;