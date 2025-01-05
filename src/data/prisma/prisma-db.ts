import { PrismaClient } from '@prisma/client';
import colors from 'colors';

export const prisma = new PrismaClient();

export class PrismaDatabase {


  static async connect() {

    try {
      await prisma.$connect();
      console.log(colors.magenta.bold(`Prisma connected to database`));
    } catch (error) {
      console.error(colors.red(`Error connecting to MySQL: ${error}`));
    }
  }
}
