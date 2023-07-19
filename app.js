const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
require("dotenv").config();
const swaggerDocument = require("./swagger.json");
const authRouter = require("./route/auth");
const operationsRouter = require("./route/operations");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", authRouter);
app.use("/", operationsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "not found" });
});
app.use((err, req, res, next) => {
  const { status = 500, message = "server error" } = err;
  res.status(status).json({ message: message });
});

module.exports = app;
