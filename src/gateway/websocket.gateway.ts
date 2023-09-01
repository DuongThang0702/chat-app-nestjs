import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageT } from 'src/utils/types';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://chat-app-nextjs-saas.vercel.app/',
    ],
  },
})
export class MessaginGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: Socket, ...args: any[]) {
    console.log('New Incoming Connection');
  }

  handleDisconnect(client: Socket) {
    console.log('user Disconnect');
  }
  @WebSocketServer()
  server: Server;

  // @SubscribeMessage('createMessage')
  // handleCreateMessage() {
  //   console.log('Create Message');
  // }

  @OnEvent('message.create')
  handleMessageCreatteEvent(payload: MessageT) {
    console.log('create message');
    const { _id, updatedAt, idConversation, ...rest } = payload;
    this.server.emit('onMessage', payload);
    this.server.emit('onNotify', rest);
  }
}
