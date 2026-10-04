/**
 * Error handling middleware
 */
export function notFound(req, res) {
  res.status(404).json({ success: false, error: 'Not found' });
}

export function errorHandler(err, _req, res, _next) {
  console.error('❌ Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ success: false, error: message });
}