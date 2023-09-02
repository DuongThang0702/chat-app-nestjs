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
      if (
        payload.author._id.toString() ===
        payload.idConversation.creator.toString()
      ) {
        const newNotify = new this.notifyModel({
          author: payload.author._id,
          recipient: payload.idConversation.recipient,
          content: payload.content,
          idConversation: payload.idConversation._id,
        });
        const response = await newNotify.save();
        return response;
      }
      if (
        payload.author._id.toString() ===
        payload.idConversation.recipient.toString()
      ) {
        const newNotify = new this.notifyModel({
          author: payload.author._id,
          recipient: payload.idConversation.creator,
          content: payload.content,
          idConversation: payload.idConversation._id,
        });
        const response = await newNotify.save();
        return response;
      }
    } else {
      const response = await this.notifyModel.findByIdAndUpdate(
        check._id.toString(),
        {
          isChecked: false,
          content: payload.content,
          idConversation: payload.idConversation._id,
        },
      );
      // const log = await response.populate(['recipient', 'author']);
      // console.log(log);

      return response;
    }
  }

  async find(user: AuthenticatedDecode, query: Partial<QueryParamsNotify>) {
    const findUser = await this.userService.findUser({ _id: user._id });
    if (!findUser)
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    const response = await this.notifyModel
      .find({ $and: [{ recipient: user._id }, { isChecked: false }] })
      .limit(query.limit ? query.limit : 5)
      .sort(query.sort ? query.sort : { createdAt: -1 })
      .populate({ path: 'author', select: '-password -refresh_token' });
    if (!response)
      new HttpException(
        'Something went wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return response;
  }

  async checkNotify(
    user: AuthenticatedDecode,
    updateStatus: boolean,
    idConversation: string,
  ) {
    const notify = await this.notifyModel.findOne({
      $and: [{ recipient: user._id }, { idConversation }],
    });
    if (!notify) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    notify.isChecked = updateStatus;
    return await notify.save();
  }

  async exsited(author: UserDocument, recipient: UserDocument) {
    return await this.notifyModel.findOne({
      author: { _id: author._id },
      recipient: { _id: recipient },
    });
  }
}
