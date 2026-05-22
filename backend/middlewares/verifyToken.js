import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (
  req,
  res,
  next
) => {

  try {

  

    const token =
      req.cookies?.token;

    if (!token) {

      return res.status(401).json({
        message:
          "Access denied. Please log in.",
      });
    }

  

    const decodedToken =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

  

    req.user = decodedToken;

    next();

  } catch (err) {

    console.log(
      "JWT Verification Error:",
      err.message
    );

    const message =
      err.name === "TokenExpiredError"
        ? "Token expired"
        : "Invalid token";

    return res.status(401).json({
      message,
    });
  }
};