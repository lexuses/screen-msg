import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { FinderService } from '../services/finder.service';

@Module({
  providers: [
      EventsGateway,
      FinderService,
  ],
})
export class EventsModule {}
