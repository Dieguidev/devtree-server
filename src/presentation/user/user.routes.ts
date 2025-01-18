import { Router } from "express";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class UserRoutes {
  static get routes( ): Router {
    const router = Router( );

    const userService = new UserService( );
    const controller = new UserController( userService );

    router.get('/',[AuthMiddleware.validateJWT], controller.getUserId);
    router.put('/',[AuthMiddleware.validateJWT], controller.updateProfile);
    router.post('/upload-image',[AuthMiddleware.validateJWT], controller.uploadImage);

    return router;
  }
}
