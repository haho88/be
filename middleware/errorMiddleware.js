const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
};

module.exports = { errorHandler };
