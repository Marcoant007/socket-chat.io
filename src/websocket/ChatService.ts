import { io } from "../http";

//recupera a conexão com o servidor
io.on("connect", socket => {
    socket.emit("O evento sapeca", {
        message: "Seu chat sapequinha começou",
    });
})