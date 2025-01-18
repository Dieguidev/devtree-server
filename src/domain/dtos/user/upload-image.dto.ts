export class UploadImageDto {
  private constructor(
    public image: string // Base64 encoded image or image URL
  ) {}

  static create(object: {
    [key: string]: any;
  }): [{ [key: string]: string }?, UploadImageDto?] {
    const { image } = object;

    const errors: { [key: string]: string } = {};

    if (!image) {
      errors.image = 'Image is required';
    } else if (!UploadImageDto.isValidImage(image)) {
      errors.image = 'Invalid image format';
    }

    if (Object.keys(errors).length > 0) {
      return [errors];
    }

    return [undefined, new UploadImageDto(image)];
  }

  private static isValidImage(image: string): boolean {
    // const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;
    const base64Pattern = /^data:image\/(png|jpg|jpeg|gif|bmp|webp);base64,/i;

    // return urlPattern.test(image) || base64Pattern.test(image);
    return base64Pattern.test(image);
  }
}
