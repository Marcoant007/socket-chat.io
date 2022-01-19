import { container } from "tsyringe";
import { io } from "../http";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { CreateMessageService } from "../services/CreateMessageService";
import { CreateUserUserService } from "../services/CreateUserService";
import { GetAllUsersService } from "../services/GetAllUsersService";
import { GetChatRoomByIdService } from "../services/GetChatRoomById";
import { GetChatRoomByUsersService } from "../services/GetChatRoomByUsersService";
import { GetMessagesByChatRoomService } from "../services/GetMessagesByChatRoomService";
import { GetUserBySocketIdService } from "../services/GetUserBySocketIdService";

//recupera a conexão com o servidor
io.on("connect", socket => {
    socket.on("start", async (data) => {
        const { name, email, avatar } = data;
        const createUserService = container.resolve(CreateUserUserService);
        const user = await createUserService.execute({ name, email, avatar, socket_id: socket.id });
        socket.broadcast.emit("new_users", user);
    }); 

    socket.on("get_users", async (callback) => {
        const getAllUsersService = container.resolve(GetAllUsersService);
        const users = await getAllUsersService.execute();

        callback(users)//essa é minha função de retorno
    });

    socket.on("start_chat", async (data, callback) => { //iniciar o chat 
        const createChatRoomService = container.resolve(CreateChatRoomService);
        const getChatRoomByUsersService = container.resolve(GetChatRoomByUsersService);
        const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
        const getMessageByChatRoomService = container.resolve(GetMessagesByChatRoomService);

        const userLogged = await getUserBySocketIdService.execute(socket.id);

        let room = await getChatRoomByUsersService.execute([data.idUser, userLogged._id]);

        if (!room) {
            room = await createChatRoomService.execute([data.idUser, userLogged._id]);

        }
        socket.join(room.idChatRoom); // estou conectando 2 usuários em uma sala 

        //Buscar mensagens da sala 
        const messages = await getMessageByChatRoomService.execute(room.idChatRoom); //vai retonar todas as mensagens que a sala tiver 
        
        callback({room, messages});
    });

    socket.on("message", async (data) => {
        // Buscar as informações do usuário (socket.id)
       
        const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);
        const user = await getUserBySocketIdService.execute(socket.id); // usuário que envia a mensagem

        const createMessageService = container.resolve(CreateMessageService);
        const getChatRoomByIdService = container.resolve(GetChatRoomByIdService)

        const message = await createMessageService.execute({
            to: user?._id,
            text: data.message,
            roomId: data.idChatRoom,
        });
        // Salvar a mensagem 

        io.to(data.idChatRoom).emit("message", {
            message,
            user //vamos passar o user pq quando for montar a tela vai precisar saber qual usuário esta mandando mensagem
        })// como eu quero enviar informação para todos usuários vou usar a comunicação global

        //enviar notificação para usuário correto
        const room = await getChatRoomByIdService.execute(data.idChatRoom);
        const userFrom = room.idUsers.find(response => response._id !== user._id);
        
        io.to(userFrom.socket_id).emit("notification", {
            newMessage: true,
            roomId: data.idChatRoom,
            from: user
        })
    })
})