
import { Validators } from '../../../config';
import { slugify } from '../../utils/generate-slug';


export class RegisterUserDto {
  private constructor(
    public name: string,
    public handle: string,
    public email: string,
    public password: string
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, RegisterUserDto?] {
    const { name, handle, email, password, passwordConfirmation } = object;

    const errors: { [key: string]: string } = {};

    if (!name) errors.name = 'Missing name';
    if (!email) errors.email = 'Missing email';
    if (email && !Validators.email.test(email)) errors.email = 'Invalid email';
    if (!handle) errors.handle = 'Missing handle';
    if (!password) errors.password = 'Missing password';
    if (password && password.length < 6)
      errors.password = 'Password must be at least 6 characters';
    if (!passwordConfirmation)
      errors.passwordConfirmation = 'Missing password confirmation';
    if (password && passwordConfirmation && password !== passwordConfirmation)
      errors.noMatch = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }


    return [
      undefined,
      new RegisterUserDto(
        name,
        slugify(handle),
        email.toLowerCase(),
        password
      ),
    ];
  }
}
