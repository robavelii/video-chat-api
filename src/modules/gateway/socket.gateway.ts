import { JwtService } from "@nestjs/jwt";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { NestGateway } from "@nestjs/websockets/interfaces/nest-gateway.interface";
import {Server, Socket} from 'socket.io'
import { UserService } from "../auth/services/user.service";
import { HttpException, HttpStatus } from "@nestjs/common";
import { NextFunction } from "express";
import { from } from "rxjs";

const CLIENT_URL = process.env.CLIENT_URL;

const corsOptions = {
  credentials: true,
  origin: CLIENT_URL, // Replace CLIENT_URL with your actual URL
};

@WebSocketGateway({cors: corsOptions, namespace: 'socket'})
export class SocketGateway implements NestGateway{
    @WebSocketServer() server: Server;
    constructor(
        private readonly jwtService: JwtService,
        private userService: UserService,
    ){}

    private onlineUsers: Map<string, {socketId: string; rooms: string[]}> = new Map();

    // initialize socket
    afterInit(){
        this.server.use((socket: Socket, next: NextFunction)=>{
            const isUserValid = this.authenticate(socket);
            if(!isUserValid){
                return next(new HttpException("error...", HttpStatus.FORBIDDEN))
            }
            return next()
        })
    }
    
    // connection
    async handleConnection(client: Socket){
        const userId = client.handshake.headers.cookie;
        this.onlineUsers.set(userId, {socketId: client.id, rooms: []})
        await this.userService.setOnlineUser(userId);

        // send message
        client.on('send-message', (data)=>{
            const sendMessageSocket = this.onlineUsers.get(data.to)
            if(sendMessageSocket){
                data.toUser = true;
                client.to(sendMessageSocket.socketId).emit('recieve-message', data);
            } else{
                data.toGroup = true;
                client.to(data.to).emit('receive-message', data)
            }
        })

        //send friend request
        client.on('send-friend-request', (data)=>{
            const sendFriendSocket = this.onlineUsers.get(data.receiveId)
            if(sendFriendSocket){
                client.to(sendFriendSocket.socketId).emit('receive-friend-request', data)
            }
        })

        // send accept friend request
        client.on('send-accept-request', (data)=>{
            const sendAcceptSocket = this.onlineUsers.get(data.to);
            if(sendAcceptSocket){
                client.to(sendAcceptSocket.socketId).emit('receive-accept-friend', data)
            }
        })

        // send notification
        client.on('send-notification', (data)=>{
            const sendNotifySocket = this.onlineUsers.get(data.to)
            if(sendNotifySocket) {
                client.to(sendNotifySocket.socketId).emit('receive-notification', data)
            }
        })

        // join group 
        client.on('join-group', (groupId)=>{
            client.join(groupId);
            this.onlineUsers.get(userId).rooms.push(groupId)
            console.log(`${userId} joined room`)

        })

        // video call
        client.on('video-call', (data)=>{
            const sendVideoSocket = this.onlineUsers.get(data.to)
            if(sendVideoSocket){
                client.to(sendVideoSocket.socketId).emit('incoming-video-call',{from:userId, ...data})
            }
        })

        // refuse call
        client.on('refuse-call', (data)=>{
            const sendRefuseSocket = this.onlineUsers.get(data.to)
            if(sendRefuseSocket){
                client.to(sendRefuseSocket.socketId).emit('refuse-call-service', {from: userId, ...data})
            }
        })

        // accept call
        client.on('accept-call', (data)=>{
            const sendAcceptSocket = this.onlineUsers.get(data.to)
            if(sendAcceptSocket){
                client.to(sendAcceptSocket.socketId).emit('accept-call-service', {from: userId, ...data})
            }
        })

        // interrupt call
        client.on('interrupt-call', (data)=>{
            const sendInterruptSocket = this.onlineUsers.get(data.to)
            if(sendInterruptSocket){
                client.to(sendInterruptSocket.socketId).emit('interrupt-call-service', {from: userId, ...data})
            }
        })

        // voice call
        client.on('voice-call', (data)=>{
            const sendVoiceSocket = this.onlineUsers.get(data.to)
            if(sendVoiceSocket){
                client.to(sendVoiceSocket.socketId).emit('incoming-voice-call',{from:userId, ...data})
            }
        })    }

    private authenticate(client: Socket){
        const token = client.handshake.headers.authorization;
        if(token){
            try {
                const data = this.jwtService.verify(token.split('')[1])
                client.handshake.headers.cookie = data.id
                return true;
            } catch (error) {
                return false
            }
        }
    }


    async handleDisconnect(client: Socket){
    console.log('disconnecting', client.handshake.headers.cookie);
    const userId = client.handshake.headers.cookie
    this.onlineUsers.get(userId).rooms.forEach((room)=>{
        client.leave(room)
    })
    this.onlineUsers.delete(userId)
    await this.userService.setUserOffline(userId)

    }
}