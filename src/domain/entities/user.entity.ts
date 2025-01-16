import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly handle: string,
    public readonly name: string,
    public readonly email: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly description?: string,
  ) {}

  static fromJson(object: { [key: string]: any }): UserEntity{
    const {
      id,
      name,
      email,
      handle,
      isActive,
      createdAt,
      description
    }= object;

    if (!id ) throw CustomError.badRequest('Missing ID');
    if (!name ) throw CustomError.badRequest('Missing name');
    if (!email ) throw CustomError.badRequest('Missing email');
    if (!handle ) throw CustomError.badRequest('Missing handle');
    if (isActive === undefined ) throw CustomError.badRequest('Missing isActive');
    if (!createdAt ) throw CustomError.badRequest('Missing createdAt');

    return new UserEntity(
      id,
      handle,
      name,
      email,
      isActive,
      createdAt,
      description
    );
  }
}
