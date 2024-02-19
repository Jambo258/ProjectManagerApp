import express, { type Request } from "express";
import session from "express-session";
import expressWebsockets from "express-ws";
import cors from "cors";
import RedisStore from "connect-redis";
import { createClient } from "redis";

import { Server, type onAuthenticatePayload } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { Database } from "@hocuspocus/extension-database";

import authenticate from "./middlewares/authenticate.js";
import requestLog from "./middlewares/requestLog.js";
import unknownEndpoint from "./middlewares/unknownEndpoint.js";
import projectsRouter from "./routes/projectRouter.js";
import pagesRouter from "./routes/pageRouter.js";
import usersRouter from "./routes/userRouter.js";
import { canEditPage, canViewPage, getPageContent, updatePageContent } from "./services/pageService.js";

const sessionSecret = process.env.BACKEND_SESSION_SECRET!;
const PORT = process.env.BACKEND_PORT!;

interface onAuthenticatePayloadWithRequest extends onAuthenticatePayload {
  request: Request;
}

const hocuspocusServer = Server.configure({
  extensions: [
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        const page = await getPageContent(Number(documentName));
        return page?.content ?? null;
      },
      store: async ({ documentName, state }) => {
        try {
          await updatePageContent(Number(documentName), state);
        } catch (err) {
          console.log("Error updating page:", documentName);
        }
      },
    }),
  ],
  port: Number(PORT),
  async onAuthenticate(data) {
    const { request, documentName } = data as onAuthenticatePayloadWithRequest;
    const sessionUserId = request.session.userId;
    const pageId = Number(documentName);
    if (!sessionUserId || !await canViewPage(sessionUserId, pageId)) {
      console.log("Not authorized! Userid =", sessionUserId, ", page =", data.documentName);
      throw new Error("Not authorized!");
    }
    if (!await canEditPage(sessionUserId, pageId)) {
      data.connection.readOnly = true;
    }
  },
  async beforeHandleMessage(data) {
    const { connection, documentName } = data;
    const request = connection.request as Request;
    const sessionUserId = Number(request.session.userId);
    const pageId = Number(documentName);
    if (!sessionUserId || !await canViewPage(sessionUserId, pageId) ) {
      throw new Error ("Not authorized!");
    }
    if (!await canEditPage(sessionUserId, pageId)) {
      connection.readOnly = true;
    }
  },
});

const { app } = expressWebsockets(express());

const isProduction = process.env.NODE_ENV === "production";

let redisStore = undefined;
if (process.env.REDIS_URL) {
  console.log("Connection to redis instance:", process.env.REDIS_URL);
  const redisClient = await createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
    // https://learn.microsoft.com/en-us/azure/azure-cache-for-redis/cache-best-practices-connection#idle-timeout
    pingInterval: 60*1000,
  })
    .on("error", err => console.error("Redis Client Error", err))
    .connect();

  redisStore = new RedisStore({
    client: redisClient,
    prefix: "projectmanagementapp:",
  });
}

app.set("trust proxy", 1);
app.use(
  session({
    store: redisStore,
    secret: sessionSecret,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: isProduction ? "none" : false, secure: isProduction ? true : false },
  })
);

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLog);

app.use("/users", usersRouter);
app.use("/projects", authenticate, projectsRouter);
app.use("/pages", authenticate, pagesRouter);

app.ws("/collaboration", (websocket, request) => {
  hocuspocusServer.handleConnection(websocket, request);
});

app.use(unknownEndpoint);

export default app;
