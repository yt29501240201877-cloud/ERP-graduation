require("dotenv").config();
const mongoose = require("mongoose");
const Users = require("../Models/Users")

const addSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB is Matched App.js");

        const existAdmin = await Users.findOne({email: process.env.Email_Admin})
        if(existAdmin) return console.log("Account Is Found");

        const superAdmin = {
            email: process.env.Email_Admin,
            password: "admin12345",
            first_name: "Super",
            last_name: "Admin",
            role: "Admin",
            image: "1782548770852.png"   
        }

        const admin = await Users.create(superAdmin);

        console.log(admin);
    } catch (error) {
        console.log(error);
    }
    finally{
        await mongoose.connection.close();
        console.log("Database Is Closed");
        process.exit(0);
    }
}

addSuperAdmin();