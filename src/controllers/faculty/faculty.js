import {
  getFacultyBySlug,
  getSortedFaculty,
} from "../../models/faculty/faculty.js";
export const facultyListPage = async (req, res) => {
  const sortBy = ["name", "department", "title"].includes(req.query.sort)
    ? req.query.sort
    : "name";
  const faculty = await getSortedFaculty(sortBy);
  res.render("faculty-directory", {
    title: "Faculty",
    faculty: faculty,
    currentSort: sortBy,
    validSort: req.query.sort
      ? ["name", "department", "title"].includes(req.query.sort)
      : true,
  });
};

export const facultyDetailPage = async (req, res, next) => {
  const { slug } = req.params;
  const faculty = await getFacultyBySlug(slug);
  console.log("facultyDetailPage: faculty:", faculty);

  if (Object.keys(faculty).length === 0) {
    const err = new Error(`Faculty ${slug} not found`);
    err.status = 404;
    return next(err);
  }
  res.render("faculty-detail", { faculty: faculty, title: faculty.name });
};
