import { User } from '@prisma/client';
import { CustomError, SearchIfTheHandleExistsDto, UploadImageDto, UserEntity } from '../../domain';
import { UpdateProfileDto } from '../../domain/dtos/user/request-update-profile.dto';
import { prisma } from '../../data/prisma/prisma-db';
import formidable from 'formidable';
import cloudinary from '../../config/cloudinary';
import { v4 as uuid } from 'uuid';

export class UserService {
  async getUserById(user: User) {
    return UserEntity.fromJson(user);
  }

  async getUserByHandle(handle: string) {
    const user = await prisma.user.findFirst({
      where: {
        handle,
      },
      include: {
        Links: true,
      },
    });

    if (!user) {
      throw CustomError.notFound('User not found');
    }

    const userEntity = UserEntity.fromJson(user);
    const { email,id, isActive, createdAt,  ...userWithoutEmail } = userEntity;

    return userWithoutEmail;
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

    const filteredLinks = links?.filter((link) => link.url) || [];

    const linkUpserts = filteredLinks.map((link) => {
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
          order: link.order,
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

  async searchIfTheHandleExists(searchIfTheHandleExistsDto: SearchIfTheHandleExistsDto) {

    const { handle } = searchIfTheHandleExistsDto
    const user = await prisma.user.findFirst({
      where: {
        handle,
      },
    });
    if (user) {
      throw CustomError.badRequest('Handle already exists');
    }

    return 'available';
  }

  private getPublicIdFromUrl(url: string): string {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
  }
}
