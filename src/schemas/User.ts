import mongoose, {Document, Schema} from "mongoose";

type User = Document  &  {
    email: String;
    socket_id: string;
    name: String;
    avatar: String;
};

const UserSchema = new Schema({
    email: String,
    socket_id: String,
    name: String,
    avatar: String
});//aqui eu passo as colunas

const User = mongoose.model<User>("Users", UserSchema);


export { User }