import { BcryptAdapter, JwtAdapter } from '../../config';
import { prisma } from '../../data/prisma/prisma-db';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { UserEntity } from '../../domain/entities/user.entity';

type HashFunction = (password: string) => string;
type ConpareFunction = (password: string, hashed: string) => boolean;

export class AuthService {
  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: ConpareFunction = BcryptAdapter.compare,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password, handle } = registerUserDto;

    const [existEmail, existHandle] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { handle } }),
    ]);

    if (existEmail) {
      throw CustomError.badRequest('Email already exists');
    }
    if (existHandle) {
      throw CustomError.badRequest('Handle already exists');
    }

    try {
      const hashPassword = this.hashPassword(password);
      const user = await prisma.user.create({
        data: { email, handle, name, password: hashPassword },
      });
      //encriptar contraseña
      // user.password = this.hashPassword(registerUserDto.password);
      // await user.save({ session });

      // const sixDigittoken = new SixDigitsTokenModel()
      // sixDigittoken.token = generateSixDigitToken()
      // sixDigittoken.user = user.id
      // console.log("Generated token:", sixDigittoken.token);
      // await sixDigittoken.save({ session })

      //enviar correo de verificacion
      // await this.sendEmailValidationLink(user.email)

      // const { password, ...userEntity } = UserEntity.fromJson(user)

      // const token = await this.generateTokenService(user.id)
      // await this.sendEmailValidationSixdigitToken({ email: user.email, name: user.name, token: sixDigittoken.token })

      return {
        user: UserEntity.fromJson(user),
        // user: userEntity,
        // token
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer(`${error}`);
    }
  }


  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw CustomError.badRequest('Invalid credentials')
    }


    //ismatch ..bcrypt
    const isMatchPassword = this.comparePassword(password, user.password)
    if (!isMatchPassword) {
      throw CustomError.badRequest('Invalid credentials')
    }

    const token = await this.generateTokenService(user.id)

    return {
      user: UserEntity.fromJson(user),
      token
    }
  }


  private async generateTokenService(id: string) {
    const token = await JwtAdapter.generateToken({ id })
    if (!token) {
      throw CustomError.internalServer('Error generating token')
    }
    return token
  }
}
