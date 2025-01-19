import { slugify } from '../../utils/generate-slug';

export class UpdateProfileDto {
  private constructor(
    public handle?: string | null,
    public description?: string | null,
    public links?: Array<{ name: string, url: string, enable: boolean, order: number }> | []
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UpdateProfileDto?] {
    const { handle, description, links } = object;



    const errors: { [key: string]: string } = {};

    if (!handle && !description)
      errors.handle = 'At least one field must be filled';

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [
      undefined,
      new UpdateProfileDto(
        handle ? slugify(handle) : null,
        description ? description : null,
        links
      ),
    ];
  }
}
