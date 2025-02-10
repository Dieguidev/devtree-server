import { CorsOptions } from "cors";
import { envs } from "./envs";

export const corsConfig: CorsOptions = {
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
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
}
