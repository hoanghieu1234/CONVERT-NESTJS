// src/module/user/user.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.contoller';
import { User, UserSchema } from './user.entity';
import { CheckAuth } from '../middleware/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckAuth)
      .forRoutes(
        { path: 'api/v1/users/update/:id', method: RequestMethod.PATCH },
        { path: 'api/v1//logout', method: RequestMethod.POST },
      );
    // .forRoutes(UserController);
  }
}
