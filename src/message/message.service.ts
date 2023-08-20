import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, Message } from 'src/utils/schema';
import { AuthenticatedDecode, PayloadCreateMessage } from 'src/utils/types';
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

    const conversation = await this.conversationModel.findById(
      payload.IdConversation,
    );
    if (!conversation)
      throw new HttpException('conversation not found', HttpStatus.BAD_REQUEST);

    if (
      conversation.creator._id.toString() !== user._id &&
      conversation.recipient._id.toString() !== user._id
    )
      throw new HttpException('cannot create message', HttpStatus.BAD_REQUEST);

    const newMessage = new this.messageModel({
      author: user._id,
      idConversation: payload.IdConversation,
      content: payload.content,
    });

    const response = await newMessage.save();
    await this.conversationModel.findByIdAndUpdate(
      payload.IdConversation,
      {
        $push: { message: response },
      },
      { new: true },
    );

    return response;
  }
}
