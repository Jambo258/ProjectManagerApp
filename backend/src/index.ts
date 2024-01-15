import app from "./server.js";

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => console.log("Listening to port", PORT));
