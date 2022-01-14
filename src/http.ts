import "reflect-metadata";
import express from "express";
import path from "path"
import {createServer} from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

const app = express();

const server = createServer(app); // quando estartar da para usar o socket o express

mongoose.connect("mongodb://localhost/rocketsocket")

app.use(express.static(path.join(__dirname, "..", "public"))); //chama a aplicação  

const io = new Server(server);

//realiza a conexão com o servidor
io.on("connection", (socket) => {
    console.log("Socket", socket.id)
})


export {server, io}