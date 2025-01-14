import { CorsOptions } from "cors";
import { envs } from "./envs";

export const corsConfig: CorsOptions = {
  // origin: '*',
  // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // preflightContinue: false,
  // optionsSuccessStatus: 204,
  // allowedHeaders: ['Content-Type', 'Authorization'],
  // credentials: true
  origin: function (origin, callback) {

    if (process.argv[2] === '--api'){
      callback(null, true);
      return;
    }

    if (origin === envs.frontendUrl) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }

  }
}
