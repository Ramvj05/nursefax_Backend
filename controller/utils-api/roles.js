const express = require("express");
const authorizer = require("../../middleware/authorizer");

const router = express.Router();

router.get("/roles", authorizer, async function (req, res) {
  try {
    const roles = [
      "CREATE_EXAM",
      "CREATE_COURSE",
      "MODIFY_EXAM",
      "LIST_EXAM",
      "CREATE_COURSE",
      "MODIFY_COURSE",
      "LIST_COURSE",
      "CREATE_TRAINING",
      "MODIFY_TRAINING",
      "LIST_TRAINING",
      "CREATE_POOL",
      "LIST_POOL",
      "MODIFY_POOL",
      "CLASSIFY_QUESTIONS",
      "VIEW_ENROLLED_STUDENT",
      "CREATE_QUESTIONS",
      "LIST_QUESTIONS",
      "MODIFY_QUESTIONS",
      "LIST_USERS",
      "MODIFY_SUBJECT",
      "CREATE_SUBJECT",
      "LIST_SUBJECT",
      "MODIFY_SUBCLASS",
      "CREATE_SUBCLASS",
      "LIST_SUBCLASS",
      "CREATE_MICROCLASS",
      "MODIFY_MICROCLASS",
      "LIST_MICROCLASS",
      "CREATE_NANOCLASS",
      "LIST_NANOCLASS",
      "MODIFY_NANOCLASS",
      "CREATE_CATEGORY",
      "CREATE_THEORY",
      "LIST_THEORY",
      "MODIFY_THEORY",
      "MODIFY_CATEGORY",
      "LIST_CATEGORY",
      "LIST_SUBCATEGORY",
      "CREATE_SUBCATEGORY",
      "MODIFY_SUBCATEGORY",
    ];

    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(200)
      .send({
        statsCode: 200,
        data: roles,
        message: "roles listed successully",
        error: null,
      });
  } catch (err) {
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(500)
      .send({
        statsCode: 500,
        data: null,
        message: "Something went wrong",
        error: err,
      });
  }
});

module.exports = router;
