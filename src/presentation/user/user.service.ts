import { User } from '@prisma/client';
import { CustomError, UserEntity } from '../../domain';
import { UpdateProfileDto } from '../../domain/dtos/user/request-update-profile.dto';
import { prisma } from '../../data/prisma/prisma-db';
import formidable from 'formidable';

export class UserService {
  async getUserById(user: User) {
    return UserEntity.fromJson(user);
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, userId: string) {
    const { handle, description } = updateProfileDto;

    if (handle) {
      const existsHandle = await prisma.user.findFirst({
        where: {
          handle,
        },
      });

      if (existsHandle && existsHandle.id !== userId) {
        throw CustomError.badRequest('Handle already exists');
      }
    }

    const userUpdate = await prisma.user.update({
      where: { id: userId },
      data: {
        handle: handle ? handle : undefined,
        description: description || undefined,
      },
    });

    return userUpdate;
  }

  async uploadImage(req){
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {

    })

    console.log('deu certo');

  }
}
