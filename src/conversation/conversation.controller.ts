import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CreateConversationDto } from './dto';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.CONVERSATION)
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATION_SERVICE)
    private readonly conversationService: ConversationService,
  ) {}

  @Post()
  async createConversation(
    @Req() req: AuthenticatedRequest,
    @Body() createConversationPayload: CreateConversationDto,
  ) {
    const response = await this.conversationService.create(
      req.user,
      createConversationPayload,
    );
    return response;
  }

  @Get()
  async getConversation(@Req() req: AuthenticatedRequest) {
    return await this.conversationService.find(req.user);
  }

  @Get(':id')
  async getConversationById(
    @Param('id') param: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.conversationService.findById(param, req.user);
  }
}
