import express, { type Request } from "express";
import session from "express-session";
import cors from "cors";
import expressWebsockets from "express-ws";
import { Server, type onAuthenticatePayload } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { Database } from "@hocuspocus/extension-database";
import usersRouter from "./routes/userRouter.js";
import projectsRouter from "./routes/projectRouter.js";
import requestLog from "./middlewares/requestLog.js";
import unknownEndpoint from "./middlewares/unknownEndpoint.js";
import pagesRouter from "./routes/pageRouter.js";
import authenticate from "./middlewares/authenticate.js";
import { canEditPage, getpageById, updatePageContent } from "./services/pageService.js";

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
        const page = await getpageById(Number(documentName));
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
    const { request } = data as onAuthenticatePayloadWithRequest;
    const sessionUserId = request.session.userId;
    if (!sessionUserId || !await canEditPage(sessionUserId, Number(data.documentName))) {
      console.log("Not authorized! Userid =", sessionUserId, ", page =", data.documentName);
      throw new Error("Not authorized!");
    }

    // You can set contextual data to use it in other hooks
    return {
      user: {
        id: sessionUserId,
        name: "John",
      },
    };
  },
});

const { app } = expressWebsockets(express());

const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24, sameSite: "none", secure: isProduction ? true : false },
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
