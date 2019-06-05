import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import {Client, Server, Socket} from 'socket.io';
import {FinderService} from '../services/finder.service';

interface MediaSetInterface {
  src: string;
  type: string;
}

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
      private finder: FinderService,
  ) {}

  @SubscribeMessage('media/all')
  async findPictures(client: Client, data: any): Promise<string[]> {
    return this.finder.getFiles('media');
  }

  @SubscribeMessage('media/set')
  async setPicture(socket: Socket, path: MediaSetInterface): Promise<void> {
    this.server.emit('screen/media', path);
  }

  @SubscribeMessage('text/set')
  async setText(socket: Socket, text: string): Promise<void> {
    this.server.emit('screen/text', text);
  }
}
