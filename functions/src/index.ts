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

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const logger = functions.logger;
admin.initializeApp();

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
    if (request.method === "GET") {
      const schoolId = request.body.schoolId;
      if (schoolId) {
        const school = await admin
          .firestore()
          .collection("schools")
          .doc(schoolId.toString())
          .get();
        if (school.exists) {
          const data = school.data();
          if (data) {
            response.send({
              id: school.id,
              name: data.name,
              location: data.location,
            });
          } else {
            response.status(500).send({error: "Data not available"});
          }
        } else {
          response.status(404).send({error: "School not found",
            request: request.body});
        }
      } else {
        response.status(400).send({error: "schoolId not provided",
          request: request.body});
      }
    } else {
      response.status(405).send("Method Not Allowed");
    }
  });
/**
 * Get a course by its ID
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
export const getCourse = functions.https.onRequest(
  async (request: Request, response: Response) => {
    if (request.method === "GET") {
      const courseId = request.body.courseId;
      if (courseId) {
        const course = await admin.firestore().collection("courses")
          .doc(courseId.toString()).get();
        if (course.exists) {
          const data = course.data();
          if (data) {
            const school = await admin
              .firestore()
              .collection("schools")
              .doc(data.school.split("/").pop())
              .get();
            response.send({
              id: course.id,
              name: data.name,
              ratings: data.ratings,
              school: school.data(),
            });
          } else {
            logger.error(`Data not available for course: ${courseId}`);
            response.status(500).send({error: "Data not available"});
          }
        } else {
          logger.warn(`Course not found: ${courseId}`);
          response.status(404).send({error: "Course not found",
            request: request.query});
        }
      } else {
        logger.error("courseId not provided");
        response.status(400).send({error: "courseId not provided",
          request: request.query});
      }
    } else {
      logger.error("Method Not Allowed, attempt to use ", request.method);
      response.status(405).send("Method Not Allowed");
    }
  });
/**
 * Search for courses by name
 *
 * @param {Request} request - The request object.
 * @param {Response} response - The response object.
 */
export const searchCourses = functions.https.onRequest(
  async (request: Request, response: Response) => {
    // Only allow GET requests
    if (request.method !== "GET") {
      response.status(405).send("Method Not Allowed");
      return;
    }
    // Prevent empty query
    const query: string = request.body.query;
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
  });
