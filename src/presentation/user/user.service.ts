import { User } from '@prisma/client';
import { CustomError, UploadImageDto, UserEntity } from '../../domain';
import { UpdateProfileDto } from '../../domain/dtos/user/request-update-profile.dto';
import { prisma } from '../../data/prisma/prisma-db';
import formidable from 'formidable';
import cloudinary from '../../config/cloudinary';
import { v4 as uuid } from 'uuid';

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

  async uploadImage(filepath: string, userId: string) {
    const result = await cloudinary.uploader.upload(filepath, { public_id: uuid() });

      if (!result) {
        throw CustomError.badRequest('Error to upload image');
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          image: result.secure_url,
        },
      });

      return user.image!;
  }
}
