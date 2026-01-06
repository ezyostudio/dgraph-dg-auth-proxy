import "dotenv/config";
import {
  createApp,
  defineEventHandler,
  getRequestHeader,
  proxyRequest,
  createError,
  getResponseHeader,
  setResponseHeader,
  H3Event,
} from "h3";

const config = {
  dgraphUrl: process.env.DGRAPH_URL,
  dgraphAuthToken: process.env.DGRAPH_AUTH_TOKEN,
};

if (!config.dgraphUrl) {
  throw new Error('Missing env variable "DGRAPH_URL"');
}

try {
  new URL("/graphql", config.dgraphUrl);
} catch (e: any) {
  if (e.message === "Invalid URL") {
    throw new Error(
      `Invalid env variable "DGRAPH_URL": use format protocol://hostname `,
    );
  }

  throw e;
}

if (!config.dgraphAuthToken) {
  throw new Error('Missing env variable "DGRAPH_AUTH_TOKEN"');
}

export const app = createApp();

app.use(
  defineEventHandler((event) => {
    if (!event.path.startsWith("/admin") && event.method !== "OPTIONS") {
      const dgAuth = getRequestHeader(event, "dg-auth");

      if (dgAuth !== config.dgraphAuthToken) {
        throw createError({
          status: 401,
          statusMessage: "Invalid DG-Auth header",
        });
      }
    }
  }),
);

app.use(
  defineEventHandler({
    handler: (event) => {
      const targetUrl = new URL(event.path, config.dgraphUrl);
      return proxyRequest(event, targetUrl.toString(), {
        onResponse(event) {
          if (!event.path.startsWith("/admin") && event.method === "OPTIONS") {
            setResponseHeader(
              event,
              "access-control-allow-headers",
              `${getResponseHeader(event, "access-control-allow-headers")}, DG-Auth`,
            );
          }
        },
      });
    },
  }),
);
