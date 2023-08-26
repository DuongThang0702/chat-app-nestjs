import { Module } from '@nestjs/common';
import { MessaginGateway } from './websocket.gateway';

@Module({ providers: [MessaginGateway] })
export class GatewayModule {}
