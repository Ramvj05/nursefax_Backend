const EmployersModel = require("../sp-admin/ServerModels/EmployerModel")
var jwt = require('jsonwebtoken');
const authorizer = require("../../middleware/authorizer");
const Auth = require("../../Helpers/Auth")

const getEmployersData = async (req, res, next) => {
    if (Auth.authorizer(req, res, next)) {
        var data = await EmployersModel.getEmployersData(req);
        // console.log(data)
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}



const saveEmployers = async (req, res, next) => {
    if (Auth.authorizer(req, res, next)) {
        var data = await EmployersModel.saveEmployers(req)
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }

}


const updateEmployers = async (req, res, next) => {
    if (Auth.authorizer(req, res)) {
        var data = await EmployersModel.updateEmployers(req);
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}
const updateEmployerStatus = async (req, res, next) => {
    if (Auth.authorizer(req, res)) {
        var data = await EmployersModel.updateEmployerStatus(req);
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}
const deleteEmployers = async (req, res, next) => {
    if (Auth.authorizer(req, res)) {
        var data = await EmployersModel.deleteEmployers(req);
        res.status(data.statusCode).send(data);
    }
    else {
        res.status(400).send({ msg: "invalid sessions" });
    }


}



module.exports = {
    getEmployersData,
    saveEmployers,
    updateEmployers,
    deleteEmployers, updateEmployerStatus
};