const mongoose = require("mongoose");

const connectedDB = async (retries = 5, delay = 3000) => {
  while (retries) {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB is Connected Successfully");

        return;

    } catch (error) {
        retries -= 1;
        console.error(`DB is failed to connect, retries left: ${retries}`);
    
        if(!retries) {
            console.error("Can't connect to the DB after multiple attempts");
            process.exit(1);
        }

        await Promise((res)=>res.setTimeout(res, delay));
    }
  }
};

module.exports = connectedDB;
