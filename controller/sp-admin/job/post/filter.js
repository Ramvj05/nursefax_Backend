const express = require("express");
const mongoose = require("mongoose");
const { dbUri } = require("../../../../endpoints/endpoints");
const PostModel = require("../../../../model/jobs/post.model");
const pagination = require("../../../../utils/pagination");

const router = express.Router();

router.post("/filter", async function (req, res) {
  const uri = dbUri;
  
  // mongoose.disconnect().then(r=>{
    mongoose.connect(uri, {

      useNewUrlParser: true,
      
      useUnifiedTopology: true
      
      }).then(async r=>{
      try {
        let query = {
          deleted: false,
        };
    
        if (Object.keys(req?.body).length > 0) {
          query = {
            ...query,
            $and: Object.entries(req.body).map(([key, value]) => ({
              [key]: value,
            })),
          };
        }
    
        const { page, pageSize } = req.body;
        let category;
        let totalElements = await PostModel.find(query).count();
        category = await pagination(PostModel.find(query), page, pageSize);
        // await mongoose.disconnect();
    
        if (category.length > 0) {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .send({
              data: category,
              message: "Data listed successfully",
              statsCode: 200,
              pageable: {
                totalElements,
                page,
                pageSize,
                currentSize: category.length,
                hasNextPage:
                  page && pageSize ? pageSize * page < totalElements : false,
                hasPreviousPage: page ? page > 1 : false,
                totalPages: pageSize ? Math.ceil(totalElements / pageSize) : 0,
              },
              error: null,
            });
        } else {
          res
            .header({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            })
            .status(200)
            .send({
              data: [],
              message: "No category Found",
              statsCode: 200,
              error: {
                message: "No data present",
              },
            });
        }
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
    }).catch(r=>console.log('connect error',r));
  // }).catch(r=>console.log('error',r));
  
  // try{
  //   await mongoose.disconnect()
  //   await mongoose.connect(uri, { dbName: "jobs" })
  // }catch(e){
  //   console.log('error e',e)
  //    return 
  // }
  
});

module.exports = router;
