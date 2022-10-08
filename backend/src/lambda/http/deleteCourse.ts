import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { deleteCourse } from "../../bussinessLogic/courses";
import { getUserId } from "../utils";
import { cors, httpErrorHandler } from "middy/middlewares";
import * as middy from "middy";

export const handler = middy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const courseId = event.pathParameters.courseId
    const userId = getUserId(event);

    await deleteCourse(userId, courseId);


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
