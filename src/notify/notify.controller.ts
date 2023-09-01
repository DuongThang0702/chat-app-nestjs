import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { NotifyService } from './notify.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { AuthenticatedRequest, QueryParamsNotify } from 'src/utils/types';

@Controller(Routes.NOTIFY)
export class NotifyController {
  constructor(
    @Inject(Services.NOTIFY_SERVICE) private notifyService: NotifyService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotices(
    @Req() req: AuthenticatedRequest,
    @Query() query: Partial<QueryParamsNotify>,
  ) {
    const { user } = req;
    if (!user) new HttpException('login required', HttpStatus.UNAUTHORIZED);
    return await this.notifyService.find(user, query);
  }
}
