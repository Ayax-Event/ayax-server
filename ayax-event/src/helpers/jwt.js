import jwt from "jsonwebtoken";
import * as jose from "jose";

const secretKey = process.env.JWT_SECRET;
console.log(secretKey, "<<<<<<<<<<<<<<<<<<secret key");

export const signToken = (payload) => {
  return jwt.sign(payload, secretKey);
};
export const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};
export const verifyWithJose = async(token) => {
  const secret = new TextEncoder().encode(secretKey);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
};
