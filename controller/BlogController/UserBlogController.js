const UserBlogsModel = require("../sp-admin/Blogs/UserBlogsModel")
var jwt = require('jsonwebtoken');
// var Auth = require("../Helpers/Auth")
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth")

const getUserBlogsData = async (req, res, next) => {
if (Auth.Verify(req, res, next)) {
    var data = await UserBlogsModel.getUserBlogsData(req);
    // console.log(data)
    res.status(data.statusCode).send(data);
    }
  

}


const saveUserBlogs = async (req, res, next) => {
    if (Auth.Verify(req, res ,next )) {
        var data = await UserBlogsModel.saveUserBlogs(req)
        res.status(data.statusCode).send(data);
    }
    // else {
    //     res.status(400).send({ msg: "invalid sessions" });
    // }

}

const updateUserBlogs = async (req, res, next) => {
    if ( Auth.Verify(req, res)) {
        var data = await UserBlogsModel.updateUserBlogs(req);
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}
const deleteUserBlogs = async (req, res, next) => {
    if ( Auth.Verify(req, res)) {
        var data = await UserBlogsModel.deleteUserBlogs(req);
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}

const deleteUserBlogsImg = async (req, res, next) => {
    if( Auth.Verify(req, res)){
        var data = await UserBlogsModel.deleteUserBlogsImg(req);    
        res.status(data.statusCode).send(data);
    }
    else{
        res.status(400).send( { msg: "invalid sessions" });
    }  
}

module.exports = {
    getUserBlogsData,
    saveUserBlogs,
    updateUserBlogs,
    deleteUserBlogs,
      deleteUserBlogsImg
};