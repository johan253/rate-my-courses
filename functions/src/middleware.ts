import {Request, Response, NextFunction} from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const {logger} = functions;

// Middleware to check if the user is authenticated
const authenticate =
async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.error("authorization header not found or invalid format");
    res.status(401).send("Unauthorized");
    return;
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
  } catch (error) {
    logger.error("error while verifying Firebase ID token:", error);
    res.status(401).send("Unauthorized");
  }
};

export default authenticate;
