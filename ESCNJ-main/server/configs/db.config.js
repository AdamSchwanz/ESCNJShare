const sql = require('mssql');

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_HOST,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

const connectDB = async () => {
    try {
        console.log("Connecting to database....");
        await sql.connect(config);
        console.log("Connected to SQL Server!");
    } catch (err) {
        console.error("Error connecting to the database:", err);
        throw err;
    }
};

module.exports = {
    sql,
    connectDB,
};
