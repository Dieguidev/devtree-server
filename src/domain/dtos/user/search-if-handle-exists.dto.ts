import { slugify } from '../../utils/generate-slug';

export class SearchIfTheHandleExistsDto {
  private constructor(public handle: string) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, SearchIfTheHandleExistsDto?] {
    const { name, handle, email, password, passwordConfirmation } = object;

    const errors: { [key: string]: string } = {};

    if (!handle) errors.handle = 'Missing handle';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new SearchIfTheHandleExistsDto(slugify(handle))];
  }
}
