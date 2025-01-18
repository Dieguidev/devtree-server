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
    const { handle, description, links } = updateProfileDto;

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

    const filteredLinks = links?.filter(link => link.url) || [];

    const linkUpserts = filteredLinks.map(link => {
      return prisma.links.upsert({
        where: {
          userId_name: {
            userId: userId,
            name: link.name,
          },
        },
        update: {
          url: link.url,
          enable: link.enable,
        },
        create: {
          name: link.name,
          url: link.url,
          enable: link.enable,
          userId: userId,
        },

      });
    });

    // Ejecutar las operaciones de upsert en una transacción
    await prisma.$transaction(linkUpserts);

    const userUpdate = await prisma.user.update({
      where: { id: userId },
      data: {
        handle: handle ? handle : undefined,
        description: description || undefined,

      },
    });

    return UserEntity.fromJson(userUpdate);
  }

  async uploadImage(filepath: string, user: User) {
    const { id: userId, image } = user;
    return await prisma.$transaction(async (prisma) => {
      const result = await cloudinary.uploader.upload(filepath, {
        public_id: uuid(),
      });
      if (!result) {
        throw CustomError.badRequest('Error to upload image');
      }

      if (user?.image) {
        const publicId = this.getPublicIdFromUrl(user.image);
        const deleteResult = await cloudinary.uploader.destroy(publicId);

        if (deleteResult.result !== 'ok') {
          throw CustomError.badRequest('Error to delete previous image');
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          image: result.secure_url,
        },
      });
      return updatedUser.image!;
    });
  }

  private getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
  }
}
