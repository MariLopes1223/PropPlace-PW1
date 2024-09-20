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
imovelRouter.get("/imoveis/local/:radius", ImovelController.findByLocale)
imovelRouter.get(
  "/imoveis/user/owner",
  verifyAuthorization,
  ImovelController.findByOwner
)

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

export default imovelRouter
