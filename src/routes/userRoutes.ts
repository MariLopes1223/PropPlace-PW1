//middleware
import validateUsuario from "../middlewares/validateUsuario";
import { verifyAuthorization } from "../middlewares/verifyAuthorization";
import { checkUserIsAllowed } from "../middlewares/checkUserIsAllowed";
//controller
import { UserController } from "../controller/UserController";

//rotas relacionadas ao usuario
import { Router } from "express";

const routesUsers = Router();

//usuario realiza login no sistema
routesUsers.post("/users/login", UserController.login);

//cria novo usuario
routesUsers.post("/users", validateUsuario.new, UserController.addUser);

//retorna todos os usuarios
routesUsers.get("/users", verifyAuthorization, UserController.listUsers);

//deleta usuario
routesUsers.delete(
  "/users/:id",
  verifyAuthorization,
  checkUserIsAllowed,
  UserController.deleteUser
);

//atualiza usuario
routesUsers.put(
  "/users/:id",
  verifyAuthorization,
  checkUserIsAllowed,
  validateUsuario.updated,
  UserController.update
);

//atualiza senha de usuário
routesUsers.patch(
  "/users/:id/password",
  verifyAuthorization,
  checkUserIsAllowed,
  validateUsuario.password,
  UserController.passwordUpdate
);

routesUsers.get(
  "/users/:username",
  verifyAuthorization,
  UserController.findUser
);

routesUsers.get(
  "/users/id/:id",
  verifyAuthorization,
  UserController.findById
);

routesUsers.post(
  "/users/enviaEmail",
  verifyAuthorization,
  UserController.enviaEmail
)

export { routesUsers };
