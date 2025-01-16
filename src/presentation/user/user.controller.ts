import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CustomError, UpdateProfileDto } from '../../domain';

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
}
