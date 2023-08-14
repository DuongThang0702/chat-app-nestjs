import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto';
import { ParamFindUser } from 'src/auth/utility';
import { hashSomthing } from 'src/utility/helper';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(payload: RegisterDto) {
    const matchedUser = await this.findUser({ email: payload.email });
    if (matchedUser)
      throw new HttpException('user has existed', HttpStatus.BAD_REQUEST);
    const password = await hashSomthing(payload.password);
    const newUser = new this.userModel({ ...payload, password });
    return await newUser.save();
  }

  async findUser(param: ParamFindUser) {
    const user = await this.userModel.findOne(param);
    return user;
  }

  async updateOne(filter, param) {
    const user = await this.userModel.findOneAndUpdate(filter, param, {
      new: true,
    });
    return user;
  }
}
