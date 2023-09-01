import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notify } from 'src/utils/schema/notify.schema';
import { AuthenticatedDecode, QueryParamsNotify } from 'src/utils/types';
import { Services } from 'src/utils/contants';
import { UserService } from 'src/user/user.service';
import { Message, UserDocument } from 'src/utils/schema';

@Injectable()
export class NotifyService {
  constructor(
    @InjectModel(Notify.name) private notifyModel: Model<Notify>,
    @Inject(Services.USER_SERVICE) private userService: UserService,
  ) {}

  async create(payload: Message) {
    const check = await this.exsited(
      payload.author,
      payload.idConversation.recipient,
    );
    if (!check) {
      const newNotify = new this.notifyModel({
        author: payload.author,
        recipient: payload.idConversation.recipient,
        content: payload.content,
      });
      const response = await newNotify.save();
      return response.populate('recipient');
    } else {
      const response = await this.findOneAndUpdate(check._id.toString(), {
        content: payload.content,
      });
      return response;
    }
  }

  async find(user: AuthenticatedDecode, query: Partial<QueryParamsNotify>) {
    const findUser = await this.userService.findUser({ _id: user._id });
    if (!findUser) new HttpException('User not found!', HttpStatus.NOT_FOUND);
    const response = await this.notifyModel
      .find({ recipient: user._id })
      .limit(query.limit ? query.limit : 5)
      .sort(query.sort ? query.sort : { createdAt: -1 });
    if (!response)
      new HttpException(
        'Something went wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return response;
  }

  async findOneAndUpdate(idNotify: string, params: {}) {
    return await this.notifyModel.findByIdAndUpdate(idNotify, params);
  }

  async exsited(author: UserDocument, recipient: UserDocument) {
    return await this.notifyModel.findOne({
      $or: [
        { author: { _id: author._id }, recipient: { _id: recipient } },
        { author: { _id: recipient }, recipient: { _id: author._id } },
      ],
    });
  }
}
