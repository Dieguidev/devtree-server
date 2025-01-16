import { slugify } from "../../utils/generate-slug";

export class UpdateProfileDto {
  private constructor(
    public handle?: string,
    public description?: string,
  ){}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UpdateProfileDto?] {
    const { handle, description } = object;

    const errors: { [key: string]: string } = {};

    if(!handle && !description) errors.handle = 'At least one field must be filled';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new UpdateProfileDto(slugify(handle), description)];
  }
}
