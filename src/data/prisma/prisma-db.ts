import { PrismaClient } from '@prisma/client';
import colors from 'colors';



export class PrismaDatabase {
  private static prisma = new PrismaClient();

  static async connect() {

    try {
      await this.prisma.$connect();
      console.log(colors.magenta.bold(`Prisma connected to database`));
    } catch (error) {
      console.error(colors.red(`Error connecting to MySQL: ${error}`));
    }
  }
}
