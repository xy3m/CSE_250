const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// ----------------------------------------------------------------------
// 1. Authentication Functions (Public)
// ----------------------------------------------------------------------

/**
 * @desc Register a User
 * @route POST /api/v1/register
 * @access Public
 */
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    // 1. Upload Avatar to Cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    // 2. Create User in Database
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    // 3. Send JWT Token response
    sendToken(user, 201, res);
});


/**
 * @desc Login User
 * @route POST /api/v1/login
 * @access Public
 */
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Check if user provided email & password
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    // 2. Find user by email and select password hash
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // 3. Compare passwords using the method defined in the UserModel
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // 4. Send JWT Token response
    sendToken(user, 200, res);
});


/**
 * @desc Logout User
 * @route GET /api/v1/logout
 * @access Public
 */
exports.logout = catchAsyncErrors(async (req, res, next) => {
    // Clear the JWT cookie
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
});


/**
 * @desc Forgot Password
 * @route POST /api/v1/password/forgot
 * @access Public
 */
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    // 1. Get Reset Password Token (method defined in UserModel)
    const resetToken = user.getResetPasswordToken();

    // Save the token/expiry to the user document
    await user.save({ validateBeforeSave: false });

    // 2. Create Reset URL and message
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your HaatBazar password reset token is: \n\n ${resetPasswordUrl} \n\nIf you have not requested this email, then ignore it.`;

    try {
        // 3. Send Email
        await sendEmail({
            email: user.email,
            subject: `HaatBazar Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        // If email fails, clear the token from the user document
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});


/**
 * @desc Reset Password
 * @route PUT /api/v1/password/reset/:token
 * @access Public
 */
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // 1. Hash the incoming reset token to match the one stored in the DB
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    // 2. Find user by the hashed token and check expiry
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Password Reset Token is invalid or has expired",
                400
            )
        );
    }

    // 3. Update password and clear reset fields
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password and Confirm Password do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // 4. Send new JWT Token response
    sendToken(user, 200, res);
});


// ----------------------------------------------------------------------
// 2. Profile Management Functions (Private)
// ----------------------------------------------------------------------

/**
 * @desc Get User Detail (My Profile)
 * @route GET /api/v1/me
 * @access Private (User)
 */
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    // req.user is set by the isAuthenticatedUser middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});


/**
 * @desc Update User Password
 * @route PUT /api/v1/password/update
 * @access Private (User)
 */
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    // 1. Check if old password is correct
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }

    // 2. Check if new passwords match
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("New Password and Confirm Password do not match", 400));
    }

    // 3. Update password field (Mongoose will hash it via pre-save hook)
    user.password = req.body.newPassword;
    await user.save();

    // 4. Send new JWT Token response
    sendToken(user, 200, res);
});


/**
 * @desc Update User Profile Details
 * @route PUT /api/v1/me/update
 * @access Private (User/Vendor)
 */
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        // 🆕 NEW HaatBazar Fields:
        mobileNumber: req.body.mobileNumber,
        address: req.body.address,
        preferredPaymentMethod: req.body.preferredPaymentMethod,
    };

    // --- Avatar Update Logic ---
    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        // 1. Delete old avatar from Cloudinary
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        // 2. Upload new avatar
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    // 3. Update the user document
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

// ----------------------------------------------------------------------
// 3. Admin Functions (Private - Admin Only)
// ----------------------------------------------------------------------

/**
 * @desc Get All Users (Admin)
 * @route GET /api/v1/admin/users
 * @access Private (Admin)
 */
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});


/**
 * @desc Get Single User Details (Admin)
 * @route GET /api/v1/admin/user/:id
 * @access Private (Admin)
 */
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});


/**
 * @desc Update User Role (Admin)
 * @route PUT /api/v1/admin/user/:id
 * @access Private (Admin)
 */
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        // Role is updated based on admin input (user, vendor, or admin)
        role: req.body.role, 
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});


/**
 * @desc Delete User (Admin)
 * @route DELETE /api/v1/admin/user/:id
 * @access Private (Admin)
 */
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404)
        );
    }

    // 1. Destroy user's avatar in Cloudinary
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    // 2. Delete the user from the database
    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});