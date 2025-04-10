import mongoose from 'mongoose';
const MessageSchema=mongoose.Schema({
    message:{
        type:String,
        required:true
    }
})
const UserSchema=mongoose.Schema({
    user_name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
})
const Message = mongoose.model("Message",MessageSchema);
const User=mongoose.model("User",UserSchema);
export  {
    Message,
    User
};