import DB_Connection from "./db/DB-Connection.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
    path:"./.env"
});

DB_Connection().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}).catch((error) => {
  console.error("Error starting the server:", error);
});