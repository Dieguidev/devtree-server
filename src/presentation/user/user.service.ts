import { User } from '@prisma/client';
import { CustomError, UserEntity } from '../../domain';
import { UpdateProfileDto } from '../../domain/dtos/user/request-update-profile.dto';
import { prisma } from '../../data/prisma/prisma-db';

export class UserService {
  async getUserById(user: User) {
    return UserEntity.fromJson(user);
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, userId: string) {
    const existsHandle = await prisma.user.findFirst({
      where: {
        handle: updateProfileDto.handle,
      },
    });

    if (existsHandle && existsHandle.id !== userId) {
      throw CustomError.badRequest('Handle already exists');
    }

    const userUpdate = await prisma.user.update({
      where: { id: userId },
      data: updateProfileDto,
    });

    return userUpdate;
  }
}
