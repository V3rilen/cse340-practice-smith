import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import MVC components
import routes from "./src/controllers/routes.js";
import { addLocalVariables } from "./src/middleware/global.js";

/**
 * Server configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

/**
 * Setup Express Server
 */
const app = express();

/**
 * Configure Express
 */
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

/**
 * Global Middleware
 */
app.use(addLocalVariables);

/**
 * Configure Express middleware
 */

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV.toLowerCase() || "production";

  // Continue to the next middleware or route handler
  next();
});

app.use((req, res, next) => {
  // Skip logging for routes that start with /. (like /.well-known/)
  if (!req.path.startsWith("/.")) {
    console.log(`${req.method} ${req.url}`);
  }
  next(); // Pass control to the next middleware or route
});

// Global middleware for time-based greeting
app.use((req, res, next) => {
  const currentHour = new Date().getHours();

  res.locals.greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
        ? "Good afternoon"
        : "Good evening";

  next();
});

// Global middleware for random theme selection
app.use((req, res, next) => {
  const themes = ["blue-theme", "green-theme", "red-theme"];

  // Your task: Pick a random theme from the array
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  res.locals.bodyClass = randomTheme;

  next();
});

// Middleware to add global data to all templates
app.use((req, res, next) => {
  // Add current year for copyright
  res.locals.currentYear = new Date().getFullYear();

  next();
});

// Global middleware to share query parameters with templates
app.use((req, res, next) => {
  // Make req.query available to all templates for debugging and conditional rendering
  res.locals.queryParams = req.query || {};

  next();
});

/**
 * Routes
 */
app.use("/", routes);

/**
 * Error Handling
 */

// 404 handler
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  // Prevent infinite loops, if a response has already been sent, do nothing
  if (res.headersSent || res.finished) {
    return next(err);
  }

  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? "404" : "500";

  // Prepare data for the template
  const context = {
    title: status === 404 ? "Page Not Found" : "Server Error",
    error: NODE_ENV === "production" ? "An error occurred" : err.message,
    stack: NODE_ENV === "production" ? null : err.stack,
    NODE_ENV, // Our WebSocket check needs this and its convenient to pass along
  };

  // Render the appropriate error template with fallback
  try {
    res.status(status).render(`errors/${template}`, context);
  } catch (renderErr) {
    // If rendering fails, send a simple error page instead
    if (!res.headersSent) {
      res
        .status(status)
        .send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
    }
  }
});

/**
 * Start WebSocket Server in Development Mode; used for live reloading
 */
if (NODE_ENV.includes("dev")) {
  const ws = await import("ws");

  try {
    const wsPort = parseInt(PORT) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
