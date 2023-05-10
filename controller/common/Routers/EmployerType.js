const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/EmployerTypeController");

router.get("/", Controller.getEmployerTypeData);
router.get("/:id", Controller.getEmployerTypeData);
router.post("/", Controller.saveEmployerType);
router.put("/:id", Controller.updateEmployerType);
router.put("/delete/:id", Controller.deleteEmployerType);

module.exports = router;
