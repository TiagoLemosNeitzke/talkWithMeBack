import express, {Application} from 'express';
import http from 'http';
import {Server, Socket} from "socket.io";

class App {
    private readonly app: Application;
    private readonly http: http.Server;
    private io: Server;

    constructor() {
        this.app = express();
        this.http = new http.Server(this.app);
        this.io = new Server(this.http, {
            cors: {
                origin: '*', // allow all
            }
        });
    }

    public listen() {
        this.http.listen(3333, () => {
            console.log('Server is running on port 3333');
        })
    }

    public listenSocket() {
        this.io.of('/streams').on('connect', this.socketEvents);
    }

    private socketEvents(socket: Socket) {
        console.log('Socket connected back end ID ==> ' + socket.id);
        socket.on('subscribe', (data) => {
            console.log('número da sala', data.roomId);
            socket.join(data.roomId);

            socket.on('chat', (data) => {
                console.log('mensagem enviada ',data)
                socket.broadcast.to(data.roomId).emit('chat', {
                    message: data.message,
                    userName: data.userName,
                    time: data.time,
                });
            })
        })
    }
}

export {App};