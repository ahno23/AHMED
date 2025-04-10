import {Message,User} from "../models/model.js";
import crypto from "crypto";
import {validationResult} from "express-validator"

function decryptMessage(encryptedMessage, key) {
    const algorithm = 'aes-256-cbc';
    const iv = Buffer.from(process.env.IV, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  
    return decrypted;
}
function encryptMessage(message, key) {
  const algorithm = 'aes-256-cbc';
  const iv = Buffer.from(process.env.IV,"hex");
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);

  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}
function generateToken(length = 64) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=[]{}|;:,.<>?';
    const bytes = crypto.randomBytes(length);
    const token = Array.from(bytes, (byte) => charset[byte % charset.length]).join('');
    return token;
}
function hash(data="",method="sha256"){
    return crypto.createHash(method).update(data).digest('hex')
}
const save_message=(msg)=>{
    Message.create({
        message:encryptMessage(msg,process.env.KEY_ENC)
    }).then((result) => {
        console.log("User created:", result);
    }).catch((error) => {
        console.error("Error creating user:", error);
    });
}
const gn_token=async (req,res)=>{
    const er = validationResult(req);
    if (!er.isEmpty()) {
        console.log(req.body)
        return res.status(400).json({status:"FAIL",data:er.array(),message:"check your input"});
    }
    try {
    const Token=generateToken(64);
    const data=    await User.findOneAndUpdate(
        { user_name:req.body.user_name,password:hash(req.body.password )}, // condition to find the user
        { token:hash(Token) },        // update data
        { new: true }       // return the updated document (default is false)
    );
    if(data){
    res.status(201).json({status:"Success",token:Token})
    }else{
        res.status(401).json({status:"FAIL",message:"username or password is not correct"})
    }
    } catch (err) {
    console.log(err)
    res.status(500).json({status:"FAIL",message:err})
    }
}
const get_message=async (req,res)=>{
    const er = validationResult(req);
    if (!er.isEmpty()) {
        return res.status(400).json({status:"FAIL",data:er.array(),message:"check your input"});
    }
    try {
        console.log(req.body.token)
    const use=await User.find(
    { token:hash(req.body.token )} 
    );
    console.log(use)
    if(use.length){
     const data=await  Message.find({})
     console.log(data)
     if(data.length){
        const messages=[data[0].message,data[1].message];
        for (let i = 2; i < data.length; i++) {
            messages.push(decryptMessage(data[i].message,process.env.KEY_ENC))
        }
        res.status(201).json({status:"Success",messages})
     }else{
        res.status(401).json({status:"FAIL",message:"no message"})
     }
    }else{
        res.status(401).json({status:"FAIL",message:"token is not correct"})
     }
    } catch (err) {
    console.log(err)
    res.status(401).json({status:"FAIL",message:"token is not correct"})
    }
}
export  {
    save_message,gn_token,get_message
};