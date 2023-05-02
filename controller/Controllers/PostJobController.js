const PostJobModel = require("../sp-admin/ServerModels/PostJobModel")
var jwt = require('jsonwebtoken');
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth")

const getPostJobData = async (req, res, next) => {
    if (Auth.authorizer(req, res, next)) {
        var data = await PostJobModel.getPostJobData(req);
        // console.log(data)
        res.status(data.statusCode).send(data);
    }
}



const savePostJob = async (req, res, next) => {
    if (Auth.authorizer(req, res, next)) {
        var data = await PostJobModel.savePostJob(req)
        res.status(data.statusCode).send(data);
    }
    // else {
    //     res.status(400).send({ msg: "invalid sessions" });
    // }

}


const updatePostJob = async (req, res, next) => {
    if (Auth.authorizer(req, res)) {
        var data = await PostJobModel.updatePostJob(req);
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}
const deletePostJob = async (req, res, next) => {
    if (Auth.authorizer(req, res)) {
        var data = await PostJobModel.deletePostJob(req);
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}



module.exports = {
    getPostJobData,
    savePostJob,
    updatePostJob,
    deletePostJob,
};