import { OnEvent } from '@nestjs/event-emitter';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [process.env.URL_CLIENT],
  },
})
export class MessaginGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {
    console.log(client);
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('Create Message');
  }

  //listien event
  @OnEvent('message.create')
  handleMessageCreatteEvent(payload: any) {
    console.log('create message');
    console.log(payload);
    this.server.emit('onMessage', payload);
  }
}
