const { sql } = require("../configs/db.config");
const authUtils = require("../utils/authUtils");

const loginUser = async (loginData) => {
    const { username, password } = loginData;
    const result = await sql.query(
        `Select * From dbo.EntityT Where Username='${username}' and IsActive=1`
    );
    if (result.recordset && result.recordset.length > 0) {
        const user = result.recordset[0];
        if (!user.TempPassword) {
            let passwordMatched = await authUtils.comparePassword(user.Password, password);
            if (!passwordMatched) {
                const error = new Error("Invalid Password!");
                error.code = 400;
                throw error;
            }
            let payload = {
                id: user.EntityID,
                username: user.Username,
            };
            let accessToken = authUtils.createAccessToken(payload);
            let refreshToken = authUtils.createRefreshToken(payload);
            await sql.query(
                `Update dbo.EntityT Set RefreshToken='${refreshToken}' where EntityID=${user.EntityID}`
            )
            return { accessToken, refreshToken, tempUser: false };

        } else {
            if (user.TempPassword !== password) {
                const error = new Error("Invalid Temp Password!");
                error.code = 400;
                throw error;
            } else {
                return { accessToken: null, refreshToken: null, tempUser: true };
            }
        }
    } else {
        const error = new Error("User Doesnt Exist with This Username!");
        error.code = 400;
        throw error;
    }
};

const setPassword = async (userData) => {
    const { username, password, newPassword } = userData;
    const result = await sql.query(
        `Select * From dbo.EntityT Where Username='${username}' and IsActive=1`
    );
    if (result.recordset && result.recordset.length > 0) {
        const user = result.recordset[0];
        if (!user.TempPassword) {
            const error = new Error("Not Temp User!");
            error.code = 400;
            throw error;
        } else {
            if (user.TempPassword !== password) {
                const error = new Error("Invalid Temp Password!");
                error.code = 400;
                throw error;
            } else {
                let hashedPassword = await authUtils.hashPassword(newPassword);
                const result2 = await sql.query(
                    `Update dbo.EntityT Set TempPassword=Null, Password='${hashedPassword}' where EntityID='${user.EntityID}'`
                )
                if (result2.rowsAffected[0] <= 0) {
                    const error = new Error("Unable to set new password");
                    error.code = 400;
                    throw error;
                }
            }
        }
    } else {
        const error = new Error("User Doesnt Exist with This Username!");
        error.code = 400;
        throw error;
    }
};

const fetchOwnerEmail = async () => {
    const result = await sql.query(
        `Select ResetEmail From dbo.S_DefaultT`
    );
    if (result.recordset && result.recordset.length > 0) {
        const defaultConfig = result.recordset[0];
        if (!defaultConfig.ResetEmail) {
            const error = new Error("Something Went Wrong!");
            error.code = 400;
            throw error;
        }
        return defaultConfig.ResetEmail;

    } else {
        const error = new Error("Something Went Wrong!");
        error.code = 400;
        throw error;
    }
};

const refreshToken = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error("Refresh Token Not Found!");
        error.code = 401;
        throw error;
    }
    const payload = authUtils.verifyRefreshToken(refreshToken);
    if (!payload) {
        const error = new Error("Invalid Refresh Token!");
        error.code = 401;
        throw error;
    }
    const result = await sql.query(
        `Select * From dbo.EntityT Where EntityID='${payload.id}'`
    );
    if (result.recordset && result.recordset.length > 0) {
        const user = result.recordset[0];
        const newPayload = { id: payload.id, username: payload.username };
        const newAccessToken = authUtils.createAccessToken(newPayload);
        const newRefreshToken = authUtils.createRefreshToken(newPayload);
        await sql.query(
            `Update dbo.EntityT Set RefreshToken='${newRefreshToken}' where EntityID=${user.EntityID}`
        );
        return { newAccessToken, newRefreshToken };
    } else {
        const error = new Error("Invalid Refresh Token!");
        error.code = 401;
        throw error;
    }
};

const logoutUser = async (refreshToken) => {
    const payload = authUtils.verifyRefreshToken(refreshToken);
    if (!payload) {
        const error = new Error("Invalid Refresh Token!");
        error.code = 401;
        throw error;
    }
    const result = await sql.query(
        `Select * From dbo.EntityT Where EntityID='${payload.id}'`
    );
    if (result.recordset && result.recordset.length > 0) {
        const user = result.recordset[0];
        await sql.query(
            `Update dbo.EntityT Set RefreshToken=NULL where EntityID=${user.EntityID}`
        );
    } else {
        const error = new Error("Invalid Refresh Token!");
        error.code = 401;
        throw error;
    }
};

module.exports = {
    loginUser,
    setPassword,
    fetchOwnerEmail,
    refreshToken,
    logoutUser
};
