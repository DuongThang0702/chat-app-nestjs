import { Module } from '@nestjs/common';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notify, NotifySchema } from 'src/utils/schema/notify.schema';
import { Services } from 'src/utils/contants';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Notify.name, schema: NotifySchema }]),
  ],
  controllers: [NotifyController],
  providers: [{ provide: Services.NOTIFY_SERVICE, useClass: NotifyService }],
  exports: [{ provide: Services.NOTIFY_SERVICE, useClass: NotifyService }],
})
export class NotifyModule {}
