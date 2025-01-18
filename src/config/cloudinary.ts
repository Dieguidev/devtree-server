import { v2 as cloudinary } from 'cloudinary';
import { envs } from './envs';

cloudinary.config({
  cloud_name: envs.cloudinaryCloudName,
  api_key: envs.cloudinaryApiKey,
  api_secret: envs.cloudinaryApiSecret // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;

