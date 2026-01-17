import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Import Routes from new modular structure
import authRoutes from "./modules/auth/index.js";
import userRoutes, { bookingRoutes, reviewRoutes } from "./modules/user/index.js";
import vendorRoutes from "./modules/vendor/index.js";
import adminRoutes from "./modules/admin/index.js";
import { serviceRoutes, notificationRoutes, uploadRoutes } from "./shared/index.js";
import publicPackageRoutes from "./modules/public/routes/package.routes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS - Must be first to handle preflight requests
const allowedOrigins = [
  "https://www.indistylo.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// 2. Logging
app.use(morgan("dev"));

// 3. Security Headers
app.use(helmet());

// 4. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. Rate limiting
const isDev = process.env.NODE_ENV !== "production";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 100, // much higher limit in dev
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 100 : 10, // much higher limit in dev
  message:
    "Too many login attempts from this IP, please try again after an hour",
});

app.use("/api", limiter);
app.use("/api/auth/send-otp", authLimiter);
app.use("/api/auth/verify-otp", authLimiter);
app.use("/api/auth/login", authLimiter);

// 6. Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/bookings/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/packages", publicPackageRoutes);

// Root route for easy health check
app.get("/", (req, res) => {
  res.status(200).send("IndiStylo Backend Running");
});

// Health check
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "IndiStylo Backend is running" });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
