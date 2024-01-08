import express from "express";
import session from "express-session";
import cors from "cors";
import usersRouter from "./routes/userRouter.js";
import projectsRouter from "./routes/projectRouter.js";
import requestLog from "./middlewares/requestLog.js";
import unknownEndpoint from "./middlewares/unknownEndpoint.js";
import pagesRouter from "./routes/pageRouter.js";
import authenticate from "./middlewares/authenticate.js";

const sessionSecret = process.env.BACKEND_SESSION_SECRET!;

const server = express();

server.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

server.use(cors({ credentials: true, origin: true }));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(requestLog);

server.use("/users", usersRouter);
server.use("/projects", authenticate, projectsRouter);
server.use("/pages", authenticate, pagesRouter);

server.use(unknownEndpoint);

export default server;
