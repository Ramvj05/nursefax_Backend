const BlogsModel = require("../sp-admin/Blogs/BlogsModel")
var jwt = require('jsonwebtoken');
// var Auth = require("../Helpers/Auth")
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth")

const getBlogsData = async (req, res, next) => {
if (Auth.Verify(req, res, next)) {
    var data = await BlogsModel.getBlogsData(req);
    // console.log(data)
    res.status(data.statusCode).send(data);
    }
  

}


const saveBlogs = async (req, res, next) => {
    if (Auth.Verify(req, res ,next )) {
        var data = await BlogsModel.saveBlogs(req)
        res.status(data.statusCode).send(data);
    }
    // else {
    //     res.status(400).send({ msg: "invalid sessions" });
    // }

}

const updateBlogs = async (req, res, next) => {
    if ( Auth.Verify(req, res)) {
        var data = await BlogsModel.updateBlogs(req);
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}
const deleteBlogs = async (req, res, next) => {
    if ( Auth.Verify(req, res)) {
        var data = await BlogsModel.deleteBlogs(req);
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}

const deleteBlogsImg = async (req, res, next) => {
    if( Auth.Verify(req, res)){
        var data = await BlogsModel.deleteBlogsImg(req);    
        res.status(data.statusCode).send(data);
    }
    else{
        res.status(400).send( { msg: "invalid sessions" });
    }  
}

module.exports = {
    getBlogsData,
    saveBlogs,
    updateBlogs,
    deleteBlogs,
      deleteBlogsImg
};