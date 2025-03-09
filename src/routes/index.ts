import { Router } from "express";
import { routesUsers } from "./userRoutes";
import imovelRouter from "./imovelRoutes";
import imagensRouter from "./imagensRoutes";
import { routeHome } from "./homeRoute";

const routes = Router();

routes.use(routeHome);
routes.use(routesUsers);
routes.use(imovelRouter)
routes.use(imagensRouter)
export {routes};