/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {Request, Response} from "express";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsModule from "cors";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const logger = functions.logger;
admin.initializeApp();
const cors = corsModule({origin: true});

/**
 * Hello World function
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
export const helloWorld = functions.https.onRequest(
  (request: Request, response: Response) => {
    if (request.method === "GET") {
      logger.info("Hello logs!", {structuredData: true});
      response.send("Hello from Firebase!");
    } else {
      response.status(405).send("Method Not Allowed");
    }
  });
/**
 * Echo the message sent in the request body
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
export const echo = functions.https.onRequest(
  (request: Request, response: Response) => {
    if (request.method === "POST") {
      const message = request.body.message;
      response.send(`You said: ${message}`);
    } else {
      response.status(405).send("Method Not Allowed");
    }
  });
/**
 * Get a school by its ID
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
export const getSchool = functions.https.onRequest(
  async (request: Request, response: Response) => {
    cors(request, response, async () => {
      if (request.method == "OPTIONS") {
        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Methods", "GET");
        response.set("Access-Control-Allow-Headers", "Content-Type");
        response.status(204).send();
      }
      // Only allow GET requests
      if (request.method !== "GET") {
        response.status(405).send("Method Not Allowed");
        return;
      }
      // Use parameters to get school ID
      const schoolId = request.query.id;
      if (!schoolId) {
        response.status(400).send({error: "school id ('id' param) not provided",
          request: request.query});
        return;
      }
      try {
        const school = await admin
          .firestore()
          .collection("schools")
          .doc(schoolId.toString())
          .get();
        if (!school.exists) {
          response.status(404).send({error: "School not found",
            request: request.query});
          return;
        }
        const data = school.data();
        if (!data) {
          response.status(500).send({error: "Data not available"});
          return;
        }
        response.send({
          id: school.id,
          name: data.name,
          location: data.location,
        });
      } catch (err) {
        logger.error("Error getting school", err);
        response.status(500).send({error: "Error getting school"});
      }
    });
  });
/**
 * Get a course by its ID
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
export const getCourse = functions.https.onRequest(
  async (request: Request, response: Response) => {
    cors(request, response, async () => {
      if (request.method == "OPTIONS") {
        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Methods", "GET");
        response.set("Access-Control-Allow-Headers", "Content-Type");
        response.status(204).send();
      }
      // Only allow GET requests
      if (request.method !== "GET") {
        response.status(405).send("Method Not Allowed");
        return;
      }
      // Use parameters to get school ID
      const courseId = request.query.id;
      if (!courseId) {
        response.status(400).send({error: "course id ('id' param) not provided",
          request: request.query});
        return;
      }
      try {
        const course = await admin
          .firestore()
          .collection("courses")
          .doc(courseId.toString())
          .get();
        if (!course.exists) {
          response.status(404).send({error: "School not found",
            request: request.query});
          return;
        }
        const data = course.data();
        if (!data) {
          response.status(500).send({error: "Data not available"});
          return;
        }
        response.send({
          ...course.data(),
        });
      } catch (err) {
        logger.error("Error getting course", err);
        response.status(500).send({error: "Error getting course"});
      }
    });
  });
/**
 * Search for courses by name
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
export const searchCourses = functions.https.onRequest(
  async (request: Request, response: Response) => {
    cors(request, response, async () => {
      if (request.method == "OPTIONS") {
        response.set("Access-Control-Allow-Origin", "*");
        response.set("Access-Control-Allow-Methods", "GET");
        response.set("Access-Control-Allow-Headers", "Content-Type");
        return response.status(204).send();
      }
      // Only allow POST requests
      if (request.method !== "GET") {
        response.status(405).send("Method Not Allowed");
        return;
      }
      // Prevent empty query
      const query: string = request.query.q as string;
      // Return code 400 if query is not provided or empty
      if (!query || query.trim() === "") {
        response.status(400).send({error: "query not provided | empty",
          request: request.body});
        return;
      }
      try {
        // Query Firestore for courses
        const snapshot = await admin.firestore()
          .collection("courses")
          .where("name", ">=", query.toUpperCase())
          .where("name", "<=", query.toUpperCase() + "\uf8ff")
          .get();

        if (snapshot.empty) {
          response.status(404).send({error: "No courses found",
            request: request.body});
          return;
        }
        // Return courses
        const courses: admin.firestore.DocumentData = [];
        snapshot.forEach((doc) => {
          courses.push({id: doc.id, ...doc.data()});
        });

        response.status(200).send(courses);
      } catch (error) {
        logger.error("Error getting documents", error);
        response.status(500).send({error: "Error getting documents"});
      }
      return;
    });
  });
