import { User } from "@prisma/client";
import { UserEntity } from "../../domain";

export class UserService {
  async getUserById(user: User){
    return UserEntity.fromJson(user);
  }
}
