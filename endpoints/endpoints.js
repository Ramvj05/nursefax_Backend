const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
// require('dotenv').config({ path: 'ENV_FILENAME' });
let host = "http://localhost:4000/api/";
// let host="http://3.111.169.246/:4000/api/"
// let host = "https://api.nursefax.com/api/";
// let userHost = "https://nursefax.com/";
let userHost = "http://localhost:3000/";
let EmployerHost = "http://localhost:5000/";

// let db = `mongodb+srv://nursefax_dedicated_user:jihOAAGj6aYtOynm@cluster0.mtfni.mongodb.net/nursefax?retryWrites=true&w=majority`;
// let jobDb = `mongodb+srv://nursefax_dedicated_user:jihOAAGj6aYtOynm@cluster0.mtfni.mongodb.net`;
// let db = `mongodb+srv://infostylusicon:infostylusicon@developmentinstance.apr6t.mongodb.net/nurseFax?retryWrites=true&w=majority`;
let db = process.env.DATABASE;
// let jobDb= process.env.DATABASE

module.exports = {
  common: {
    medaiUpload: `${host}/utils/media`,
  },
  otp: {
    create: `${host}/auth/otp/create`,
    verify: `${host}/auth/otp/verify`,
  },
  question: {
    update: `${host}/course-admin/question/update/`,
    remove: `${host}/course-admin/question/remove`,
    random: `${host}/course-admin/question/random/`,
  },
  subject: {},
  subClass: {
    delete: `${host}/course-admin/subclass/delete/`,
  },
  microClass: {
    delete: `${host}/course-admin/microclass/delete/`,
  },
  nanoClass: {
    delete: `${host}/course-admin/nanoclass/delete/`,
  },
  quesionPool: {
    getAll: `${host}/do-exam/get-all-questions`,
    create: `${host}/course-admin/question-pool/create`,
  },
  examPool: {
    create: `${host}/exam/create`,
    approved: `${host}/exam/approved`,
  },
  license: {
    buy: `${host}/licence/buy`,
  },
  courseAdmin: {},
  category: {},
  subCategory: {
    delete: `${host}/course-admin/subcategory/delete/`,
  },
  admin: {},
  user: {},
  utils: {},
  host: host,
  userHost: userHost,
  dbUri: db,
  // jobDbUri: jobDb,
};
