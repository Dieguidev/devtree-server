import { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { UserRoutes } from "./user/user.routes";

export class AppRoutes {
  static get routes():Router {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes)
    router.use('/api/user', UserRoutes.routes)

    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World'
      })
    })

    return router;
  }
}
