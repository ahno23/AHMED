import mongoose from 'mongoose';
 const MessageSchema=mongoose.Schema({
    message:{
        type:String,
        required:true
    }
})
export const Message = mongoose.model("Message",MessageSchema);
export default Message;