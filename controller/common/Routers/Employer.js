const express = require("express");
const router = express.Router();
const Controller = require("../../Controllers/EmployerController");

router.get("/", Controller.getEmployersData);
router.get("/:id", Controller.getEmployersData);
router.post("/", Controller.saveEmployers);
router.put("/:id", Controller.updateEmployers);
router.put("/profile/:id", Controller.updateEmployerProfile);
router.put("/active/:id", Controller.updateEmployerStatus);
router.put("/delete/:id", Controller.deleteEmployers);

module.exports = router;
