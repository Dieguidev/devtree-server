import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CustomError, UpdateProfileDto, UploadImageDto } from '../../domain';
import formidable from 'formidable';
import cloudinary from '../../config/cloudinary';
import { v4 as uuid } from 'uuid';

export class UserController {
  constructor(private readonly userService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' });
  };

  getUserId = (req: Request, res: Response) => {
    this.userService
      .getUserById(req.user!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  updateProfile = (req: Request, res: Response) => {
    const [error, updateProfileDto] = UpdateProfileDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.userService
      .updateProfile(updateProfileDto!, req.user!.id)
      .then(() => res.json({ message: 'Profile updated successfully' }))
      .catch((error) => this.handleError(error, res));
  };

  uploadImage = (req: Request, res: Response) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      console.log(files.file![0].filepath);

      cloudinary.uploader.upload(
        files.file![0].filepath,
        {public_id: uuid()},
        (error, result) => {
          if (error) {
            throw CustomError.badRequest('Error to upload image');
          }
          if (result) {
            console.log(result);
          }
        }
      );
    });
    // const [error, uploadImageDto] = UploadImageDto.create(req.body);
    // if (error) {
    //   res.status(400).json({ error });
    //   return;
    // }

    // this.userService
    //   .uploadImage(req)
    //   .then(() => res.json({ message: 'Image uploaded successfully' }))
    //   .catch((error) => this.handleError(error, res));
  };
}
