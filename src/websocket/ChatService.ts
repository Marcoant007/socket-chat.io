import { container } from "tsyringe";
import { io } from "../http";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { CreateUserUserService } from "../services/CreateUserService";
import { GetAllUsersService } from "../services/GetAllUsersService";
import { GetUserBySocketIdService } from "../services/GetUserBySocketIdService";

//recupera a conexão com o servidor
io.on("connect", socket => {
    socket.on("start", async (data) => {
        const { name, email, avatar } = data;
        const createUserService = container.resolve(CreateUserUserService);

        const user = await createUserService.execute({ name, email, avatar, socket_id: socket.id });

        //quero que atualize os usuários novos, para todos os usuários menos os usuários do socket 
        //ou seja envie para todos os usuários, menos para este usuários
        socket.broadcast.emit("new_users", user);

    }); //vou receber as informações

    socket.on("get_users", async (callback)=> {
        const getAllUsersService = container.resolve(GetAllUsersService);
        const users = await getAllUsersService.execute();

        callback(users)//essa é minha função de retorno
    });

    socket.on("start_chat", async (data, callback)=> {
        const createChatRoomService = container.resolve(CreateChatRoomService);
        const getUserBySocketIdService = container.resolve(GetUserBySocketIdService);

        const userLogged = await getUserBySocketIdService.execute(socket.id);
        const room = await createChatRoomService.execute([data.idUser, userLogged._id]);
        console.log(room);

        callback(room);

    })

})