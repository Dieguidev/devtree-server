import { envs } from "./config";
import { PrismaDatabase } from "./data/prisma/prisma-db";
import { AppRoutes } from "./presentation/routes";
// import { MongoDatabase } from "./data/mongodb";

import { Server } from "./presentation/server";


(() => {
  main();
})()

async function main() {

  await PrismaDatabase.connect();

  new Server({
    port: envs.port,
    routes: AppRoutes.routes
  }).start()
}
