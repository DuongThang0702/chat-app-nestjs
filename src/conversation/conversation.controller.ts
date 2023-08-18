import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateConversationDto } from './dto';

@Controller(Routes.CONVERSATION)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATION_SERVICE)
    private readonly conversationService: ConversationService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createConversation(
    @Req() req,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    return await this.conversationService.create(
      req.user,
      createConversationPayload,
    );
  }
}
