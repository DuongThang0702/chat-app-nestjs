import { Controller, Inject, Post, Req, UseGuards, Body } from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { AuthenticatedRequest, PayloadCreateMessage } from 'src/utils/types';
import { createMessage } from './dto';

@Controller(Routes.MESSAGE)
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGE_SERVICE)
    private readonly messageService: MessageService,
  ) {}

  @Post()
  async createMessage(
    @Req() req: AuthenticatedRequest,
    @Body() payload: createMessage,
  ) {
    const response = await this.messageService.create(req.user, payload);
    return response;
  }
}
