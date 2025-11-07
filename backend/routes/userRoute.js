// backend/routes/userRoute.js

const express = require("express");
const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

// --- Public Routes ---
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

// --- User/Private Routes ---
// Get logged-in user details
router.route("/me").get(isAuthenticatedUser, getUserDetails);
// Update user password
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
// Update user profile (name, email, mobile, address, payment)
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// --- Admin Routes ---
// Get all users
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
// Get, Update role, or Delete user by ID
router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


module.exports = router;