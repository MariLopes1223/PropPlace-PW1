import { Router } from "express"
import { verifyAuthorization } from "../middlewares/verifyAuthorization";
import { homeController } from "../controller/homeController"

const routeHome = Router();

routeHome.get("/home", verifyAuthorization, homeController.getInfoHome);

export { routeHome };
