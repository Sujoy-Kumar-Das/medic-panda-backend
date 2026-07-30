import { Server as HttpServer } from "http";
import { ServerOptions, Server as SocketServer } from "socket.io";
import { allowdOrigins } from "../../app";
import AppError from "../errors/AppError";


let io:SocketServer | null = null;

export const initSocket = (server:HttpServer,options?:Partial<ServerOptions>):SocketServer=>{

     io = new SocketServer(server,{
        cors:{
            origin:allowdOrigins,
            credentials:true,
            methods:["GET","POST"]
        },
        ...options
    });

    return io;
}


export const getIO = ():SocketServer=>{
    if(!io){
        throw new AppError(503,"Socket.io initialization fialed.")
    }

    return io;
}
