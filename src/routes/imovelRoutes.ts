import { Router } from "express"
import checkEdificeExists from "../middlewares/checkEdificeExists"
import checkEdificeExistsAndBelongs from "../middlewares/checkEdificeExistsById"
import { ImovelController } from "../controller/imovelController"
import validateImovel from "../middlewares/validateImovel"
import { verifyAuthorization } from "../middlewares/verifyAuthorization"

const imovelRouter = Router()

imovelRouter.post(
    "/imoveis",
    verifyAuthorization,
    checkEdificeExists,
    validateImovel.new,
    ImovelController.add
)

imovelRouter.get("/imoveis", ImovelController.list)
imovelRouter.get("/imoveis/tipo/:tipo", ImovelController.findByType)
imovelRouter.get("/imoveis/nome/:nome", ImovelController.findByName)
imovelRouter.get("/imoveis/id/:id", ImovelController.findById)
imovelRouter.get("/imoveis/local/:radius", ImovelController.findByLocale)

imovelRouter.get(
  "/imoveis/user/owner",
  // por padrão retorna imoveis do user autenticado
  // retorna imoveis de user especifico com parametro de query opcional:
  // ?id="userId"
  verifyAuthorization,
  ImovelController.findByOwner
);

imovelRouter.delete(
    "/imoveis/:id",
    verifyAuthorization,
    checkEdificeExistsAndBelongs,
    ImovelController.delete
)

imovelRouter.patch(
    "/imoveis/:id/nome",
    verifyAuthorization,
    checkEdificeExistsAndBelongs,
    validateImovel.nome,
    ImovelController.updateName
)
imovelRouter.patch(
    "/imoveis/:id/local",
    verifyAuthorization,
    checkEdificeExistsAndBelongs,
    validateImovel.local,
    ImovelController.updateLocale
)
imovelRouter.patch(
    "/imoveis/:id/disponivel",
    verifyAuthorization,
    checkEdificeExistsAndBelongs,
    validateImovel.disponivel,
    ImovelController.updateAvailability
)
// update imovel. recebe no body todos os mesmos atributos de criação de imovel
// inclusive os campos não atualizados
// portanto um objeto do tipo ImovelBody.
imovelRouter.put(
  "/imoveis/:id",
  verifyAuthorization,
  checkEdificeExistsAndBelongs,
  validateImovel.new,
  ImovelController.update
);

export default imovelRouter
