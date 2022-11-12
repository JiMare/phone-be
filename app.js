const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const personsRouter = require("./controllers/persons");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
morgan.token("body", (request) => JSON.stringify(request.body));
app.use(express.static("build"));

app.use("/api/persons", personsRouter);

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint);

// handler of requests with result to errors
app.use(middleware.errorHandler);

module.exports = app;
