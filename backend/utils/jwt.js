// parse env variebles to intergrates with the fallback value
const accessTokenExpires = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);

const refreshTokenExpires = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

// Options for cookies
export const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 60 * 60 * 1000),
  maxAge: accessTokenExpires * 60 * 60 * 1000,
  httpOnly: true,
  samesite: "lax",
};

export const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
  httpOnly: true,
  samesite: "lax",
};

export const sendToken = (user, statusCode, res) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  const role = user.role;

  res.status(statusCode).json({
    success: true,
    role,
    accessToken,
  });
};
