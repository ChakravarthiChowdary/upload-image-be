import express, { NextFunction, Request, Response } from "express";
import { json, urlencoded } from "body-parser";
import mongoose from "mongoose";
import fileupload from "express-fileupload";

import HttpError from "./models/HttpError";
import path from "path";
import router from "./routes/images";

const app = express();
app.use(json());

app.use(fileupload());

app.use(
  urlencoded({
    extended: false,
    limit: "50mb",
  })
);
app.use(express.static(path.join(__dirname, "/controllers/public/")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

const port = process.env.PORT || 5000;

app.use("/app/v1/image", router);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.code || 500).json({
    error: {
      message: err.message || "Server is busy at the moment !",
      statusCode: err.code || 500,
      requestStatus: "Fail",
    },
  });
});

mongoose
  .connect(
    `mongodb+srv://chakri:chakri@cluster0.pkkrb.mongodb.net/uploadimages?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
