import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.development'], isGlobal: true }),
    MongooseModule.forRoot(process.env.URL_MONGOOSE),
    MailerModule.forRoot({
      transport: process.env.MAIL_TRANSPORT,
      defaults: {
        from: `"No Reply" <${process.env.MAIL_FROM}>`,
      },
      template: {
        dir: join(__dirname, 'templates/email'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
