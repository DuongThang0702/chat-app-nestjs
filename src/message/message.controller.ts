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
import { ParamGetMessageFromConversation } from './dto/getMessageFromConversation';

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

  @Get(':idc')
  async getMessageFromConversation(@Param('idc') idConversation: string) {
    return await this.messageService.getMessageFromConversation(idConversation);
  }
}
