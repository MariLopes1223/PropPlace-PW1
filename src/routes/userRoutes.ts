//middleware
import validateUsuario from "../middlewares/validateUsuario"
import { verifyAuthorization } from "../middlewares/verifyAuthorization"
import { checkUserIsAllowed } from "../middlewares/checkUserIsAllowed"
//controller
import { UserController } from "../controller/UserController"

//rotas relacionadas ao usuario
import { Router } from "express"

const routesUsers = Router()

//usuario realiza login no sistema
routesUsers.post("/users/login", UserController.login)

//cria novo usuario
routesUsers.post("/users", validateUsuario.new, UserController.addUser)

//retorna todos os usuarios
routesUsers.get("/users", verifyAuthorization, UserController.listUsers)

//deleta usuario
routesUsers.delete(
    "/users/:id",
    verifyAuthorization,
    checkUserIsAllowed,
    UserController.deleteUser
)

//atualiza usuario
routesUsers.put(
    "/users/:id",
    verifyAuthorization,
    checkUserIsAllowed,
    validateUsuario.new,
    UserController.update
)

//atualiza senha de usuário
routesUsers.patch(
    "/users/:id/password",
    verifyAuthorization,
    checkUserIsAllowed,
    validateUsuario.password,
    UserController.passwordUpdate
)

//busca usuario por username
routesUsers.get(
    "/users/:username",
    verifyAuthorization,
    UserController.findUser
)

//retorna id do usuário que possui o username enviado
routesUsers.get("users/:username", verifyAuthorization, UserController.findId)

export { routesUsers }
