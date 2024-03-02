import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const DEFAULT_SIGN_OPTION = {
  expiresIn: "1h",
};

const signJwtAccessToken = (payload, options = DEFAULT_SIGN_OPTION) => {
  const secret_key = process.env.SECRET;
  const token = jwt.sign(payload, secret_key, options);

  return token;
};

const verifyJwt = (token) => {
  try {
    const secret_key = process.env.SECRET;
    const decoded = jwt.verify(token, secret_key);
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { signJwtAccessToken, verifyJwt };
