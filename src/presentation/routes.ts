import { Router } from "express";
import { AuthRoutes } from "./auth/auth.routes";

export class AppRoutes {
  static get routes():Router {
    const router = Router();

    router.use('/api/auth', AuthRoutes.routes)

    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World'
      })
    })

    return router;
  }
}
