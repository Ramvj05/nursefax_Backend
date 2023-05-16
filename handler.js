const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const upload = require("express-fileupload");
const app = express();
const path = require("path");
const auth = require("./controller/auth");
const spAdmin = require("./controller/sp-admin");
const courseAdmin = require("./controller/course-admin");
const users = require("./controller/common/users");
const utilsApi = require("./controller/utils-api");
const exam = require("./controller/common/exam-pool/index");
const course = require("./controller/common/course");
const doExam = require("./controller/common/do-exam");
const takeCourseAssessment = require("./controller/common/take_course_assessment");
const license = require("./controller/common/licence");
const notes = require("./controller/common/notes");
const learningList = require("./controller/common/learning-list");
const list = require("./controller/common/list");
const community = require("./controller/common/community");
const jobs = require("./controller/sp-admin/job");
const Blog = require("./controller/common/Routers/Blogs");
const invoice = require("./controller/common/invoice");
const updateUserPassword = require("./controller/updateUserPassword");
const UserRatings = require("./controller/common/Routers/UserRatings");
const BlogCategories = require("./controller/common/Routers/BlogCategories");
const wishlist = require("./controller/common/Routers/wishlist");
const employer = require("./controller/common/Routers/Employer");
const postjob = require("./controller/common/Routers/PostJob");
const postevent = require("./controller/common/Routers/PostEvent");
const employertype = require("./controller/common/Routers/EmployerType");
const jobfilter = require("./controller/common/Routers/JobFilter");

const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(cors());
app.use(express.json());
app.use(upload());
app.use(express.static("../Backend/uploads/"));

app.use(
  "/api/Banner_image/",
  express.static(path.join(__dirname + `/uploads/Blogs/`))
);
app.use(
  "/api/Banners_image/",
  express.static(path.join(__dirname + `/uploads/BlogsCategories/`))
);
app.use(
  "/api/EmpPost/",
  express.static(path.join(__dirname + `/uploads/Employers/`))
);
app.use(
  "/api/EventPost/",
  express.static(path.join(__dirname + `/uploads/Event/`))
);

app.use("/api", auth);
app.use("/api", spAdmin);
app.use("/api", courseAdmin);
app.use("/api", users);
app.use("/api", doExam);
app.use("/api", takeCourseAssessment);
app.use("/api", utilsApi);
app.use("/api", exam);
app.use("/api", course);
app.use("/api", license);
app.use("/api", notes);
app.use("/api", learningList);
app.use("/api", jobs);
app.use("/api", list);
app.use("/api", community);
app.use("/api", invoice);
app.use("/api", updateUserPassword);
app.use("/api/blog", Blog);
app.use("/api/userratings", UserRatings);
app.use("/api/blogcategories", BlogCategories);
app.use("/api/wishlist", wishlist);
app.use("/api/employer", employer);
app.use("/api/postjob", postjob);
app.use("/api/event", postevent);
app.use("/api/employertype", employertype);
app.use("/api/jobfilter", jobfilter);

var PORT = 4000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Example app listening at localhost:${PORT}`);
});
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Api Not Found",
  });
});

module.exports.handler = serverless(app);

// /api/course/finish/theory/
// /api/course/finish/sub-theory/
// /api/course/theory/finished/
// /api/course/assessment/passed/
// /api/course/certificate
