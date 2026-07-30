import { Server as SocketServer } from "socket.io";



const socketEventService = (io:SocketServer)=>{
    io.on("connect",(socket)=>{
    console.log("socket connected successfully");
})
}


export default socketEventService;
