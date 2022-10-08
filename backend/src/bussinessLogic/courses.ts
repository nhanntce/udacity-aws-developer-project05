import * as uuid from "uuid";

import { CourseAccess } from "../dataLayer/courseAccess";
import { AttachMentUtils } from "../helper/attachmentUtils";
import { Course } from "../models/Course";
import { CreateCourseRequest } from "../requests/CreateCourseRequest";
import { UpdateCourseRequest } from "../requests/UpdateCourseRequest";

const courseAccess = new CourseAccess();

const attachmentUtils = new AttachMentUtils();

const BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET;

const getCoursesByUserId = async (userId: string): Promise<Course[]> => {
  return courseAccess.getCoursesByUserId(userId);
};

const createCourse = async (
  createCourseRequest: CreateCourseRequest,
  userId: string
): Promise<Course> => {
  const courseId = uuid.v4() as string;

  return await courseAccess.createCourse({
    courseId,
    userId,
    name: createCourseRequest.name,
    cost: createCourseRequest.cost,
    duration: createCourseRequest.duration,
    progress: 0
  });
};

const updateCourse = async (
  updateCourseRequest: UpdateCourseRequest,
  userId: string,
  courseId: string
): Promise<void> => {
  await courseAccess.updateCourse({
    courseId,
    userId,
    name: updateCourseRequest.name,
    cost: updateCourseRequest.cost,
    duration: updateCourseRequest.duration,
    progress: updateCourseRequest.progress,
  });
};

const deleteCourse = async (userId: string, courseId: string): Promise<void> => {
  await courseAccess.deleteCourse(userId, courseId);
};

const createPresignedUrl = async (fileName: string): Promise<string> => {
  return await attachmentUtils.createPresignedUrl(fileName);
};

const updateAttachmentUrl = async (courseId: string, userId: string): Promise<void> => {
  const attachmentUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${courseId}`;
  await courseAccess.updateAttachmentUrl(courseId, userId, attachmentUrl);
};


export {
  getCoursesByUserId,
  createCourse,
  updateCourse,
  deleteCourse,
  createPresignedUrl,
  updateAttachmentUrl, 
};
