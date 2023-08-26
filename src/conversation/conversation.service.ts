import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, User } from '../utils/schema/';
import { Model, Types } from 'mongoose';
import { CreateConversationDto } from './dto';
import { Services } from 'src/utils/contants';
import { UserService } from 'src/user/user.service';
import { AuthenticatedDecode } from 'src/utils/types';
import { MessageService } from 'src/message/message.service';
@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @Inject(Services.USER_SERVICE)
    private readonly userService: UserService,
    @Inject(Services.MESSAGE_SERVICE)
    private readonly messageService: MessageService,
  ) {}

  async create(author: AuthenticatedDecode, payload: CreateConversationDto) {
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

    const exists = await this.isCreated(author._id, recipient._id.toString());

    if (exists)
      throw new HttpException(
        'Conversation Already Exists',
        HttpStatus.BAD_REQUEST,
      );

    const newConversation = new this.conversationModel({
      creator: author._id,
      recipient: recipient._id,
    });
    const response = await newConversation.save();
    const lastmessage = await this.messageService.create(author, {
      content: payload.message,
      IdConversation: response._id.toString(),
    });
    response.lastMessage = lastmessage;
    return response;
  }

  async findById(_id: string, user: AuthenticatedDecode) {
    const isValidObjectId = Types.ObjectId.isValid(_id);
    if (!isValidObjectId)
      throw new HttpException('invalid id', HttpStatus.BAD_REQUEST);
    const response = await this.conversationModel.findOne({
      $and: [
        { _id },
        {
          $or: [
            { creator: { _id: user._id } },
            { recipient: { _id: user._id } },
          ],
        },
      ],
    });
    if (!response)
      throw new HttpException('conversation not found', HttpStatus.BAD_REQUEST);

    return response;
  }

  async find(user: AuthenticatedDecode) {
    const findConversation = await this.conversationModel
      .find({
        $or: [{ creator: { _id: user._id } }, { recipient: { _id: user._id } }],
      })
      .populate({ path: 'creator', select: '-password -refresh_token' })
      .populate({ path: 'recipient', select: '-password -refresh_token' })
      .populate('lastMessage');

    if (!findConversation)
      throw new HttpException('conversation not found', HttpStatus.BAD_REQUEST);

    return findConversation;
  }

  async isCreated(creator: string, recipient: string) {
    return await this.conversationModel.findOne({
      $or: [
        { creator: { _id: creator }, recipient: { _id: recipient } },
        { creator: { _id: recipient }, recipient: { _id: creator } },
      ],
    });
  }
}
