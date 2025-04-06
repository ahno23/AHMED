import Message from "../models/model.js";
const save_message=(msg)=>{
    Message.create({
        message:msg
    }).then((result) => {
        console.log("User created:", result);
    }).catch((error) => {
        console.error("Error creating user:", error);
    });
}
export default save_message