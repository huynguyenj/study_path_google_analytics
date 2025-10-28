export const errorHandle = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500
  const responseError = {
      success: false,
      message: err.message
  }
  return res.status(err.statusCode).json(responseError)
}