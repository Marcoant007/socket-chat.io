import { server } from "./http";
import "./websocket/ChatService";


server.listen(3000, ()=> console.log("Servidor rodando na porta 3000"));