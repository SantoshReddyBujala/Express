const express = require("express");
const router = express.Router();
const employeeController = require("../../controllers/employeesController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(verifyRoles(ROLES_LIST.admin), employeeController.createNewEmployee)
  .put(verifyRoles(ROLES_LIST.admin), employeeController.updateEmployee)
  .delete(verifyRoles(ROLES_LIST.admin), employeeController.deleteEmployee);

router
  .route("/:id")
  .get(employeeController.getEmployee);

module.exports = router;
