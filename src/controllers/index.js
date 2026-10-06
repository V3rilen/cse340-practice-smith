// Route handlers for static pages
export const homePage = (req, res) => {
  res.render("home", { title: "Home" });
};

export const aboutPage = (req, res) => {
  res.render("about", { title: "About" });
};

export const demoPage = (req, res) => {
  res.render("demo", { title: "Middleware Demo Page" });
};

export const testErrorPage = (req, res, next) => {
  const err = new Error("This is a test error");
  err.status = 500;
  next(err);
};
