//Essa funão é para pegar as mensagens por sala 

import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

@injectable()
class GetMessagesByChatRoomService {

    async execute(roomId: string) {
        const messages = await Message.find({
            roomId,
        })
            .populate('to')
            .exec();

        return messages;
    }

}
export { GetMessagesByChatRoomService };