import { ObjectId } from "mongoose";
import { injectable } from "tsyringe";
import { ChatRoom } from "../schemas/ChatRoom";

@injectable()
class GetChatRoomByUsersService {

    //vai precisar receber os ids e verificar se dentro do id users existem
    //quero buscar a sala que tenha usuário x e usuário y
    async execute(idUsers: ObjectId[]){
        const room = await ChatRoom.findOne({
            idUsers: {
                $all: idUsers
            }
        }).exec();

        //vai verificar se tem alguma sala que o idUsers estejam dentro dessa sala e retorna a sala 
        //se não tiver, vamos salvar essa sala 

        return room
    }

}

export {GetChatRoomByUsersService}