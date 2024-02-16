import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserSettings } from './schemas/user-setting.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
  ) {}

  async create({ settings, ...userData }: CreateUserDto) {
    const userExists = await this.userModel.exists({
      username: userData.username,
    });
    if (userExists) {
      throw new BadRequestException('Username already in use');
    }
    let newSettings;
    console.log({ settings });
    if (settings) {
      newSettings = new this.userSettingsModel(settings);
      newSettings = await newSettings.save();
    }

    const user = new this.userModel({
      ...userData,
      settings: settings ? newSettings._id : undefined,
    });
    return user.save();
  }

  async getById(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new NotFoundException();
    const user = await this.userModel.findById(userId).populate('settings');
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  getAll() {
    return this.userModel.find().populate(['settings', 'posts']);
  }

  update(userData: UpdateUserDto) {
    const { id, ...rest } = userData;
    return this.userModel.findByIdAndUpdate(id, { ...rest }, { new: true });
  }

  delete(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new NotFoundException();
    return this.userModel.findByIdAndDelete(userId);
  }
}
