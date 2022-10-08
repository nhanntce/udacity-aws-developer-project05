import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { createCourse } from "../../bussinessLogic/courses";
import { CreateCourseRequest } from "../../requests/CreateCourseRequest";
import { getUserId } from "../utils";
import { cors, httpErrorHandler } from "middy/middlewares";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const createTodoRequest: CreateCourseRequest = JSON.parse(event.body);

    const userId = getUserId(event);

    const item = await createCourse(createTodoRequest, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        item,
      }),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
