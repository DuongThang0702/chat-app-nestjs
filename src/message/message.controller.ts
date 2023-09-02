import {
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
  Body,
  Get,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { AuthenticatedRequest } from 'src/utils/types';
import { createMessage } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotifyService } from 'src/notify/notify.service';

@Controller(Routes.MESSAGE)
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGE_SERVICE)
    private readonly messageService: MessageService,
    private eventEmitter: EventEmitter2,
    @Inject(Services.NOTIFY_SERVICE) private notifyService: NotifyService,
  ) {}

  @Post()
  async createMessage(
    @Req() req: AuthenticatedRequest,
    @Body() payload: createMessage,
  ) {
    const { user } = req;
    const response = await this.messageService.create(user, payload);
    await this.notifyService.create(response);
    this.eventEmitter.emit('message.create', response.toObject());
    return response ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  @Get(':idc')
  async getMessageFromConversation(@Param('idc') idConversation: string) {
    return await this.messageService.getMessageFromConversation(idConversation);
  }
}
