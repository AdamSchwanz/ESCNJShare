const userService = require("../services/userService");
const emailService = require("../services/emailService");

const Login = async (req, res, next) => {
    try {
        const data = { ...req.body };
        const { accessToken, refreshToken, tempUser } = await userService.loginUser(data);
        if (refreshToken) {
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
            });
        }
        res.status(200).json({ token: accessToken, tempUser });
    } catch (error) {
        next(error);
    }
};

const SetPassword = async (req, res, next) => {
    try {
        const data = { ...req.body };
        await userService.setPassword(data);
        res.status(200).json({ message: "New Password has been set, Please login again to continue" });
    } catch (error) {
        next(error);
    }
};

const ForgotPassword = async (req, res, next) => {
    try {
        const { username, email, companyName } = req.body;
        const ownerEmail = await userService.fetchOwnerEmail();
        const emailContent = `
        Hello, you have a password reset request.
        ${companyName ? `Company: ${companyName},` : ''}
        Email: ${email}${username ? ',' : ''}
        ${username ? `UserName: ${username}` : ''}
        `;
        await emailService.sendEmail(ownerEmail, "Forgot Password!", emailContent)
        res.status(200).json({ message: "Email Sent!" });
    } catch (error) {
        next(error);
    }
};

const RefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        const { newAccessToken, newRefreshToken } = await userService.refreshToken(refreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });
        res.status(200).json({ token: newAccessToken });
    } catch (error) {
        next(error);
    }
};

const Logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await userService.logoutUser(refreshToken);
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });
        res.status(200).json({ message: "Logged Out Successfully!" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    Login,
    SetPassword,
    ForgotPassword,
    RefreshToken,
    Logout
};
