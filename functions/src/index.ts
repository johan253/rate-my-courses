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

export const helloWorld = functions.https.onRequest(
  (request: Request, response: Response) => {
    if (request.method === "GET") {
      logger.info("Hello logs!", {structuredData: true});
      response.send("Hello from Firebase!");
    } else {
      response.status(405).send("Method Not Allowed");
    }
  });

export const echo = functions.https.onRequest(
  (request: Request, response: Response) => {
    if (request.method === "POST") {
      const message = request.body.message;
      response.send(`You said: ${message}`);
    } else {
      response.status(405).send("Method Not Allowed");
    }
  });

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
            request: request.query});
        }
      } else {
        response.status(400).send({error: "schoolId not provided",
          request: request.query});
      }
    } else {
      response.status(405).send("Method Not Allowed");
    }
  });

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
            const school = admin
              .firestore()
              .collection("schools")
              .doc(data.school.toString())
              .get();
            response.send({
              id: course.id,
              name: data.name,
              ratings: data.ratings,
              school: school,
            });
          } else {
            response.status(500).send({error: "Data not available"});
          }
        } else {
          response.status(404).send({error: "Course not found",
            request: request.query});
        }
      } else {
        response.status(400).send({error: "courseId not provided",
          request: request.query});
      }
    } else {
      response.status(405).send("Method Not Allowed");
    }
  });
