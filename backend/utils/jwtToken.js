// backend/utils/jwtToken.js

// Send token and save in cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token
  });
};

module.exports = sendToken;

