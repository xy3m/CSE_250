// backend/utils/jwtToken.js

// Send token and save in cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // FORCE SECURE COOKIES FOR DEPLOYMENT
    // (Render requires 'trust proxy' if behind a proxy, but usually this works)
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
