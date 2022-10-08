import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { getCoursesByUserId } from "../../bussinessLogic/courses";
import { getUserId } from "../utils";
import { cors, httpErrorHandler } from "middy/middlewares";
import * as middy from "middy";

export const handler = middy(async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Get course", event);

  const userId = getUserId(event);

  const items = await getCoursesByUserId(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items,
    }),
  };
})

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
