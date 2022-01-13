import express from "express";
import path from "path"
import {createServer} from "http";
import { Server } from "socket.io";

const app = express();

const server = createServer(app); // quando estartar da para usar o socket o express

app.use(express.static(path.join(__dirname, "..", "public"))); //chama a aplicação  

const io = new Server(server);

//realiza a conecão com o servidor
io.on("connection", (socket) => {
    console.log("Socket", socket.id)
})


export {server, io}