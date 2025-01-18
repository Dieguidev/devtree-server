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
      if (err) {
        return this.handleError(err, res);
      }

      const file = files.file as formidable.File | formidable.File[];
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      console.log(files.file);


      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
      if (!validMimeTypes.includes(files.file![0].mimetype as string)) {
        return res.status(400).json({ error: 'Invalid image format' });
      }

      this.userService
        .uploadImage(files.file![0].filepath, req.user!.id)
        .then((user) => res.json(user))
        .catch((error) => this.handleError(error, res));
    });
    // const [error, uploadImageDto] = UploadImageDto.create(req.body);
    // if (error) {
    //   res.status(400).json({ error });
    //   return;
    // }

    // this.userService
    //   .uploadImage(files.file![0].filepath)
    //   .then(() => res.json({ message: 'Image uploaded successfully' }))
    //   .catch((error) => this.handleError(error, res));
  };
}
