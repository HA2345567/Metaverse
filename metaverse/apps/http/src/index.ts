import express = require("express");
import { router } from "./routes/v1";
const app = express();
import client from "@repo/db";

app.use(express.json()); // Add JSON body parsing middleware

app.use("/api/v1", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});