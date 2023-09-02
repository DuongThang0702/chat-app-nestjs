import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, Message } from 'src/utils/schema';
import { AuthenticatedDecode } from 'src/utils/types';
import { createMessage } from './dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async create(user: AuthenticatedDecode, payload: createMessage) {
    const isValidId = Types.ObjectId.isValid(payload.IdConversation);
    if (!isValidId)
      throw new HttpException('invalid id', HttpStatus.BAD_REQUEST);

    const conversation = await this.conversationModel.findOne({
      $and: [
        { _id: payload.IdConversation },
        {
          $or: [
            { creator: { _id: user._id } },
            { recipient: { _id: user._id } },
          ],
        },
      ],
    });

    if (!conversation)
      throw new HttpException(
        'conversation not found or cannot create message',
        HttpStatus.BAD_REQUEST,
      );

    const newMessage = new this.messageModel({
      author: user._id,
      idConversation: payload.IdConversation,
      content: payload.content,
    });

    const saveMessage = await newMessage.save();
    await this.conversationModel.findByIdAndUpdate(
      payload.IdConversation,
      {
        $push: { message: saveMessage },
        lastMessage: saveMessage,
      },
      { new: true },
    );

    const response = await saveMessage.populate([
      {
        path: 'author',
        select: '-password -refresh_token',
      },
      { path: 'idConversation' },
    ]);
    return response;
  }

  async getMessageFromConversation(param: string) {
    const isValidObjectId = Types.ObjectId.isValid(param);
    if (!isValidObjectId)
      throw new HttpException('invalid idConversation', HttpStatus.NOT_FOUND);
    const messages = await this.messageModel
      .find({ idConversation: param })
      .sort({ createdAt: 'desc' })
      .populate({ path: 'author', select: '-password -refresh_token' });

    if (!messages)
      throw new HttpException('conversation not found', HttpStatus.BAD_REQUEST);
    return messages;
  }
}
