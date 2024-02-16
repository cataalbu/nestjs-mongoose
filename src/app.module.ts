import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestjs-tutorial'),
    UsersModule,
    PostsModule,
  ],
  controllers: [UsersController, PostsController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {}
