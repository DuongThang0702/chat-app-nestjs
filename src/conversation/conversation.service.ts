import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './conversation.schema';
import { Model, Types } from 'mongoose';
import { CreateConversationDto } from './dto';
import { Services } from 'src/utils/contants';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/type';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @Inject(Services.USER_SERVICE)
    private readonly userService: UserService,
  ) {}
  async create(author: User, payload: CreateConversationDto) {
    if (author.email === payload.email)
      throw new HttpException(
        'Cannot create Conversation with yourself',
        HttpStatus.BAD_REQUEST,
      );

    const recipient = await this.userService.findUser({
      email: payload.email,
    });

    if (!recipient)
      throw new HttpException('recipient not found', HttpStatus.BAD_REQUEST);

    const exists = await this.isCreated(author._id, recipient._id);
    if (exists)
      throw new HttpException(
        'Conversation Already Exists',
        HttpStatus.BAD_REQUEST,
      );

    const newConversation = new this.conversationModel({
      creator: author._id,
      recipient: recipient._id,
    });
    return await newConversation.save();
  }

  async isCreated(creator: Types.ObjectId, recipient: Types.ObjectId) {
    return await this.conversationModel.find({
      where: [
        {
          creator: { _id: creator },
          recipient: { _id: recipient },
        },
        {
          creator: { id: recipient },
          recipient: { id: creator },
        },
      ],
    });
  }
}
