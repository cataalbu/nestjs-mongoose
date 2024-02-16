import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dtos/create-post.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(postData: CreatePostDto) {
    const { userId, ...restPostData } = postData;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User id is not valid');
    }

    const savedPost = new this.postModel({ ...restPostData });
    const post = await savedPost.save();

    await user.updateOne({
      $push: {
        posts: savedPost._id,
      },
    });
    return post;
  }

  getById() {}

  getAll() {}

  update() {}

  delete() {}
}
