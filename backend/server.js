import express from "express";
const router = express.Router();
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import connectDb from "./connectDB.js";
import ProductRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/errorMiddleware.js";
import userRoute from "./Routes/userRoutes.js";
import { authMiddleware } from "./Middleware/authMiddleware.js";
import orderRoute from "./Routes/orderRoutes.js";
import Validator from "node-input-validator";
import aes256 from "aes256";
import axios from "axios";
import route from "./Routes/recaptcha.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
connectDb();

app.use("/recaptcha", route);
app.use("/product", ProductRoute);
app.use("/user", userRoute);
app.use("/order", orderRoute);
app.use("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);
app.use("/api/config/googleSiteKey", (req, res) =>
  res.send(process.env.REACT_APP_GOOGLE_SITE_KEY)
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on Port ${process.env.PORT}`.yellow.bold);
});
