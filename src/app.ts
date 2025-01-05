import { envs } from "./config";
import { AppRoutes } from "./presentation/routes";
// import { MongoDatabase } from "./data/mongodb";

import { Server } from "./presentation/server";


(() => {
  main();
})()

async function main() {

  // await MongoDatabase.connect({
  //   dbName: envs.MONGO_DB_NAME,
  //   mongoUrl: envs.MONGO_URL,
  // })

  new Server({
    port: envs.port,
    routes: AppRoutes.routes
  }).start()
}
