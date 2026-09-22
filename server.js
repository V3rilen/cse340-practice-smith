import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "production";
const name = process.env.NAME;

const app = express();

app.use((req, res, next) => {
  // Make NODE_ENV available to all templates
  res.locals.NODE_ENV = NODE_ENV.toLowerCase() || "production";
  // Continue to the next middleware or route handler
  next();
});
/**
 * Routes
 */
app.get("/", (req, res) => {
  const title = "Home";
  res.render("home", { title });
});

app.get("/about", (req, res) => {
  const title = "About Me";
  res.render("about", { title });
});

app.get("/products", (req, res) => {
  const title = "Products";
  res.render("products", { title });
});

app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the templating engine
app.set("view engine", "ejs");
// Tell Express where to find your templates
app.set("views", path.join(__dirname, "src/views"));

// When in development mode, start a WebSocket server for live reloading
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

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
