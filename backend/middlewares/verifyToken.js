import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const verifyToken = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Session verification failed. Access denied." });
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