const express = require("express");
const mongooes = require("mongoose");
const { dbUri } = require("../../../endpoints/endpoints");
const authorizer = require("../../../middleware/authorizer");
const pagination = require("../../../utils/pagination");
const router = express.Router();
const LicenseModel = require("../../../model/license.model");
const userModel = require("../../../model/user.model");

router.post("/list-licences", authorizer, async (req, res) => {
  const { user } = req.headers.user;
  await mongooes.connect(dbUri);
  if (user.roles.includes("ADMIN")) {
    const page = req?.body?.page || false;
    const pageSize = req?.body?.pageSize || false;
    delete req.body.page;
    delete req.body.pageSize;
    let query = {
      ...req.body,
      deleted: false,
    };
    try {
      let totalElements = await LicenseModel.find(query).count();
      const licenceData = await pagination(
        LicenseModel.find(query),
        page,
        pageSize
      );
      let newData = [];
      for (let index = 0; index < licenceData.length; index++) {
        const element = licenceData[index];
        const userData = await userModel.findOne(
          {
            _id: element.studentId,
            userType: 2,
            deleted: false,
          },
          { password: 0 }
        );
        newData = [
          ...newData,
          {
            ...element._doc,
            user: userData._doc,
          },
        ];
      }
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(200)
        .send({
          statsCode: 200,
          data: {
            data: newData,
            pageable: {
              totalElements,
              page,
              pageSize,
              currentSize: licenceData.length,
              hasNextPage:
                page && pageSize ? pageSize * page < totalElements : false,
              hasPreviousPage: page ? page > 1 : false,
              totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
            },
          },
          message: "Data Found",
          error: null,
        });
    } catch (err) {
      console.log(err);
      res
        .header({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        })
        .status(500)
        .send({
          statsCode: 500,
          data: null,
          message: "Somthing went wrong",
          error: err,
        });
    }
  } else {
    res
      .header({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      })
      .status(404)
      .send({
        statsCode: 404,
        data: null,
        message: "Do not access to list licence details",
        error: { message: "Access denied." },
      });
  }
});

module.exports = router;
