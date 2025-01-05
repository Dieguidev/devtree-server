import { Router } from "express";

export class AppRoutes {
  static get routes():Router {
    const router = Router();

    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World'
      })
    })

    return router;
  }
}
