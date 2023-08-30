import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://chat-app-nextjs-saas.vercel.app/',
    ],
  },
})
export class MessaginGateway implements OnGatewayConnection {
  handleConnection(client: Socket, ...args: any[]) {
    console.log('New Incoming Connection');
    client.emit('connected');
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('Create Message');
  }

  @OnEvent('message.create')
  handleMessageCreatteEvent(payload: any) {
    console.log('create message');
    this.server.emit('onMessage', payload);
  }
}
