import { ObjectId } from "mongoose";
import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
class GetChatRoomByUsersService {

    //vai precisar receber os ids e verificar se dentro do id users existem
    //quero buscar a sala que tenha usuário x e usuário y
    async execute(idUsers: ObjectId[]){
        console.log(idUsers);
        const room = await ChatRoom.findOne({
            idUsers: {
                $all: idUsers
            }
        }).exec();

        console.log(room);

        //vai verificar se tem alguma sala que o idUsers estejam dentro dessa sala e retorna a sala 
        //se não tiver, vamos salvar essa sala 

        return room
    }

}

export {GetChatRoomByUsersService}