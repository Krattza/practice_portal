// Needs to run fist before anything loads so env is not undefined
import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import pool from './src/config/db.js'
import runMigrations from "./src/config/migrations.js";

const PORT = process.env.PORT || 8500

app.listen(PORT, ()=> {
    console.log(` Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
})