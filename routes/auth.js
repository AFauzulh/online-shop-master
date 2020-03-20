const express = require("express");
const {
    check,
    body
} = require("express-validator/check");

const User = require("../models/user");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.get("/new-password", authController.getNewPassword);

router.get("/reset/:token", authController.getNewPassword);

router.post(
    "/login",
    [
        check("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email"),

        body(
            "password",
            "Please enter a password with only number and text and at least 5 characters."
        )
        .isLength({
            min: 5
        })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin
);

router.post(
    "/signup",
    [
        check("email")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom((value, {
            req
        }) => {
            return User.findOne({
                email: req.body.email
            }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                        "Email already registered !"
                    );
                }
            });
        })
        .normalizeEmail(),

        body(
            "password",
            "Please enter a password with only number and text and at least 5 characters."
        )
        .isLength({
            min: 5
        })
        .isAlphanumeric()
        .trim(),

        body("confirmPassword")
        .trim()
        .custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error("Password have to match!");
            }
            return true;
        })
    ],
    authController.postSignup
);

router.post("/logout", authController.postLogout);

router.post("/reset", authController.postReset);

router.post("/new-password", authController.postNewPassword);

module.exports = router;