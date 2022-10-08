import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { createPresignedUrl } from "../../bussinessLogic/courses";
import { cors, httpErrorHandler } from "middy/middlewares";
import * as middy from "middy";

export const handler = middy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const courseId = event.pathParameters.courseId;

  const uploadUrl = await createPresignedUrl(courseId);

  return {
    statusCode: 200,
    body: JSON.stringify({
        uploadUrl
    })
  };
})


handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
