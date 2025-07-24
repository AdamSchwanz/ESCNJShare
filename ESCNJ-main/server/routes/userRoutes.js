const router = require("express").Router();
const controller = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const userSchemas = require('../validationSchemas/userSchemas');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post(
    "/login",
    validationMiddleware.validateRequest(userSchemas.loginSchema),
    controller.Login
);

router.post(
    "/set-password",
    validationMiddleware.validateRequest(userSchemas.setPasswordSchema),
    controller.SetPassword
);

router.post(
    "/forgot-password",
    validationMiddleware.validateRequest(userSchemas.forgotPasswordSchema),
    controller.ForgotPassword
);

router.post(
    "/refresh-token",
    controller.RefreshToken
);

router.post(
    "/logout",
    controller.Logout
);

module.exports = router;
