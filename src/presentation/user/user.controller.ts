import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CustomError, SearchIfTheHandleExistsDto, UpdateProfileDto, UploadImageDto } from '../../domain';
import formidable from 'formidable';


export class UserController {
  constructor(private readonly userService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);

    return res.status(500).json({ error: 'Internal Server Error' });
  };

  getUserByHandle = (req: Request, res: Response) => {
    this.userService
      .getUserByHandle(req.params.handle)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
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

      const validMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
      ];
      if (!validMimeTypes.includes(files.file![0].mimetype as string)) {
        return res.status(400).json({ error: 'Invalid image format' });
      }

      this.userService
        .uploadImage(files.file![0].filepath, req.user!)
        .then((user) => res.json(user))
        .catch((error) => this.handleError(error, res));
    });
  };

  searchIfTheHandleExistsDto = (req: Request, res: Response) => {
    const [error, searchIfTheHandleExistsDto] = SearchIfTheHandleExistsDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    this.userService
      .searchIfTheHandleExists(searchIfTheHandleExistsDto!)
      .then((exists) => res.json(exists))
      .catch((error) => this.handleError(error, res));
  }
}
