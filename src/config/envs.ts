
import 'dotenv/config'

import * as joi from 'joi'
import jwt from 'jsonwebtoken';

interface EnvVars {
  PORT: number
  JWT_SECRET: string
  FRONTEND_URL: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  JWT_SECRET: joi.string().required(),
  FRONTEND_URL: joi.string().required(),
  CLOUDINARY_CLOUD_NAME: joi.string().required(),
  CLOUDINARY_API_KEY: joi.string().required(),
  CLOUDINARY_API_SECRET: joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}


const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  frontendUrl: envVars.FRONTEND_URL,
  cloudinaryCloudName: envVars.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: envVars.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: envVars.CLOUDINARY_API_SECRET,
}


