require("dotenv").config();
const cors = require("cors");

const express = require("express");
const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

const path = require("path");

app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

app.use(express.json());

app.get('/test',(req,res)=>{
    res.json({msg:'test'})
});

const connect = require("./Config/db")
connect();

const adminRoutes = require("./Routes/usersRoutes");


app.use('/api/dashboard', adminRoutes)


const port = process.env.PORT || 3000;
    
app.listen(port,()=>{
    console.log("Server Running");
});