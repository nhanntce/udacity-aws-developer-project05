import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import { UpdateCourseRequest } from "../../requests/UpdateCourseRequest";
import { updateCourse } from "../../bussinessLogic/courses";
import { getUserId } from "../utils";
import { cors, httpErrorHandler } from "middy/middlewares";
import * as middy from "middy";

export const handler = middy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const courseId = event.pathParameters.courseId;
  const userId = getUserId(event);
  const updatedCourse: UpdateCourseRequest = JSON.parse(event.body);

  await updateCourse(updatedCourse, userId, courseId);

  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
})

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
