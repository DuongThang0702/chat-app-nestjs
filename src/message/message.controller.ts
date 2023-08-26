import {
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { AuthenticatedRequest } from 'src/utils/types';
import { createMessage } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.MESSAGE)
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGE_SERVICE)
    private readonly messageService: MessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @Req() req: AuthenticatedRequest,
    @Body() payload: createMessage,
  ) {
    const response = await this.messageService.create(req.user, payload);
    //create message in socket
    this.eventEmitter.emit('message.create', response);
    return response;
  }

  @Get(':idc')
  async getMessageFromConversation(@Param('idc') idConversation: string) {
    return await this.messageService.getMessageFromConversation(idConversation);
  }
}
