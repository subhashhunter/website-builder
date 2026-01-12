import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRouter from "./routes/userRoutes.js";
import Projectrouter from "./routes/projectRoutes.js";
import { stripeWebhook } from "./controllers/stripeWebhooks.js";

const app = express();

app.set("trust proxy", 1);

// ---- CORS CONFIG ----
const trustedOrigins =
  process.env.TRUSTED_ORIGINS?.split(",") ?? [];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (trustedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-CSRF-Token",
    "X-Better-Auth",
  ],
};

// 1️⃣ CORS FIRST
app.use(cors(corsOptions));

// 2️⃣ OPTIONS PREFLIGHT
app.options("*", cors(corsOptions));

// 3️⃣ JSON PARSER
app.use(express.json({ limit: "50mb" }));

// 4️⃣ Stripe webhook (raw body only here)
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// 5️⃣ Better Auth
app.all("/api/auth/*", toNodeHandler(auth));

// 6️⃣ Other routes
app.use("/api/user", userRouter);
app.use("/api/project", Projectrouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
