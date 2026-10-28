import { Router } from "express";
import { addDemoHeaders } from "../middleware/demo/headers.js";
import { catalogPage, courseDetailPage } from "./catalog/catalog.js";
import { homePage, aboutPage, demoPage, testErrorPage } from "./index.js";
import { facultyListPage, facultyDetailPage } from "./faculty/faculty.js";
import contactRoutes from "./forms/contact.js";
import registrationRoutes from "./forms/registration.js";
import loginRoutes from "./forms/login.js";
import { processLogout, showDashboard } from "./forms/login.js";
import { requireLogin } from "../middleware/auth.js";

// Create a new router instance
const router = Router();

// Add catalog-specific styles to all catalog routes
router.use("/catalog", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
  next();
});

router.use("/faculty", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
  next();
});

// Add contact-specific styles to all contact routes
router.use("/contact", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
  next();
});

// Add registration-specific styles to all registration routes
router.use("/register", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
  next();
});

// Add login-specific styles to all login routes
router.use("/login", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/login.css">');
  next();
});

// Home and basic pages
router.get("/", homePage);
router.get("/about", aboutPage);

// Course catalog routes
router.get("/catalog", catalogPage);
router.get("/catalog/:slugId", courseDetailPage);

// Faculty routes
router.get("/faculty", facultyListPage);
router.get("/faculty/:slug", facultyDetailPage);

// Demo page with special middleware
router.get("/demo", addDemoHeaders, demoPage);

// Route to trigger a test error
router.get("/test-error", testErrorPage);

// Contact form routes
router.use("/contact", contactRoutes);

// Registration routes
router.use("/register", registrationRoutes);

// Login routes (form and submission)
router.use("/login", loginRoutes);

// Authentication-related routes at root level
router.get("/logout", processLogout);
router.get("/dashboard", requireLogin, showDashboard);

export default router;
