import express from "express";
import session from "express-session";
import cors from "cors";
import usersRouter from "./routes/userRouter.js";
import projectsRouter from "./routes/projectRouter.js";
import requestLog from "./middlewares/requestLog.js";
import unknownEndpoint from "./middlewares/unknownEndpoint.js";
import pagesRouter from "./routes/pageRouter.js";

const PORT = process.env.BACKEND_PORT;
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

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(requestLog);

server.use("/user", usersRouter);
server.use("/projects", projectsRouter);
server.use("/pages", pagesRouter);

server.use(unknownEndpoint);
server.listen(PORT, () => console.log("Listening to port", PORT));
