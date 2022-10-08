import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
  } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
  import "source-map-support/register";
  import { updateAttachmentUrl } from "../../bussinessLogic/courses";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";
  
const log = createLogger("updateAttachmentUrl");

  export const handler = middy(async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    const courseId = event.pathParameters.courseId;
    const userId = getUserId(event);
  
    log.info(`Course Id ${courseId}`);
    await updateAttachmentUrl(courseId, userId);
  
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
  