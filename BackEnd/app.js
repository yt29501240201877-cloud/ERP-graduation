require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const connect = require("./Config/db")

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}));

connect();

app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

app.get('/test',(req,res)=>{
    res.json({msg:'test'})
});

const adminRoutes = require("./Routes/usersRoutes");
app.use('/api/dashboard', adminRoutes)

module.exports = app;