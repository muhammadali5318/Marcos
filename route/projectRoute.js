const router = require("express").Router();
const {
  authentication,
  restrictUser,
} = require("../controller/authController");
const {
  createProject,
  getAllProject,
  getProjectById,
  updateProjectById,
  deleteProjectById
} = require("../controller/projectController");

router
  .route("/")
  .post(authentication, restrictUser("1"), createProject)
  .get(authentication, getAllProject);

router
  .route("/:id")
  .get(authentication, restrictUser("1"), getProjectById) // GET specific project by ID
  .put(authentication, restrictUser("1"), updateProjectById) // Update specific project by ID
  .delete(authentication, restrictUser("1"), deleteProjectById); // Delete specific project by ID
module.exports = router;
