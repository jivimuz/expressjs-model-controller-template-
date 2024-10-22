const express = require('express');
require('express-group-routes');

const UserController = require('../controllers/UserController');

const router = express.Router()

// Add Here
router.group("/users", (route) => {
    route.get("/", UserController.getUsers);
    route.get("/:id", UserController.getUserByID);
    route.post("", UserController.createUser);
    route.patch("/:id", UserController.updateUser);
    route.delete("/:id", UserController.deleteUser);
});

module.exports = router;