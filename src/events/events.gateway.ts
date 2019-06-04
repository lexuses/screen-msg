import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import {Client, Server, Socket} from 'socket.io';
import {FinderService} from '../services/finder.service';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
      private finder: FinderService,
  ) {}

  @SubscribeMessage('pictures/all')
  async findPictures(client: Client, data: any): Promise<string[]> {
    return this.finder.getFiles('pictures');
  }

  @SubscribeMessage('pictures/set')
  async setPicture(socket: Socket, path: string): Promise<void> {
    this.server.emit('screen/picture', path);
  }

  @SubscribeMessage('text/set')
  async setText(socket: Socket, text: string): Promise<void> {
    this.server.emit('screen/text', text);
  }
}
