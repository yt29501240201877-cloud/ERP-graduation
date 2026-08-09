require("dotenv").config();

const http = require("http");

const app = require("./app");
const server = http.createServer(app);

const {initializeSocket} = require("./Sockets/socket");
initializeSocket(server);

const port = process.env.PORT || 5000;

server.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
});