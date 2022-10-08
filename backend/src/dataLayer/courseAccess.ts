import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";
const AWSXRay = require("aws-xray-sdk");

import { Course } from "../models/Course";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);

const log = createLogger("Course Access");

export class CourseAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly courseTable = process.env.COURSES_TABLE
  ) {}

  async getCoursesByUserId(userId: string): Promise<Course[]> {
    log.info(`[START] Get course by user id: ${userId}`);
    const result = await this.docClient
      .query({
        TableName: this.courseTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();
    return result.Items as Course[];
  }

  async createCourse(course: Course): Promise<Course> {
    log.info(`[START] Create course: ${JSON.stringify(course)}`);
    await this.docClient
      .put({
        TableName: this.courseTable,
        Item: course,
      })
      .promise();

    return course;
  }

  async updateCourse(course: Course): Promise<Course> {
    log.info(`[START] Update course: ${JSON.stringify(course)}`);
    await this.docClient
      .update({
        TableName: this.courseTable,
        Key: { courseId: course.courseId, userId: course.userId },
        UpdateExpression:
          "set #name = :name, #duration = :duration, #cost = :cost, #progress = :progress",
        ExpressionAttributeNames: {
          "#name": "name",
          "#duration": "duration",
          "#cost": "cost",
          "#progress": "progress",
        },
        ExpressionAttributeValues: {
          ":name": course.name,
          ":duration": course.duration,
          ":cost": course.cost,
          ":progress": course.progress,
        },
      })
      .promise();

    return course;
  }

  async deleteCourse(userId: string, courseId: string): Promise<void> {
    log.info(`[START] Delete course id: ${courseId}`);
    await this.docClient
      .delete({
        TableName: this.courseTable,
        Key: {
          courseId,
          userId,
        },
      })
      .promise();

    return;
  }

  async updateAttachmentUrl(
    courseId: string,
    userId: string,
    attachmentUrl: string
  ): Promise<void> {
    log.info(`[START] Update attachment url of courseId: ${courseId}`);
    await this.docClient
      .update({
        TableName: this.courseTable,
        Key: { courseId, userId },
        UpdateExpression: "set #attachmentUrl = :attachmentUrl",
        ExpressionAttributeNames: {
          "#attachmentUrl": "attachmentUrl",
        },
        ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl,
        },
      })
      .promise();
  }
}

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient();
}
