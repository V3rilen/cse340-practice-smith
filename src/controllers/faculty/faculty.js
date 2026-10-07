import {
  getFacultyById,
  getSortedFaculty,
} from "../../models/faculty/faculty.js";

export const facultyListPage = (req, res) => {
  const sortBy = ["name", "department", "title"].includes(req.query.sort)
    ? req.query.sort
    : "name";
  const faculty = getSortedFaculty(sortBy);
  res.render("faculty-directory", {
    title: "Faculty",
    faculty: faculty,
    currentSort: sortBy,
    validSort: req.query.sort
      ? ["name", "department", "title"].includes(req.query.sort)
      : true,
  });
};

export const facultyDetailPage = (req, res, next) => {
  const { id } = req.params;
  const faculty = getFacultyById(id);
  if (!faculty) {
    const err = new Error(`Faculty ${id} not found`);
    err.status = 404;
    return next(err);
  }
  res.render("faculty-detail", { faculty: faculty, title: faculty.name });
};
