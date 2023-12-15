import { Router } from "express"
import checkEdificeExistsAndBelongs from "../middlewares/checkEdificeExistsById"
import multer from "multer"
import uploadConfig from "../config/upload"
import imagensController from "../controller/imagensController"
import { verifyAuthorization } from "../middlewares/verifyAuthorization"
import { checkImovelBelongs } from "../middlewares/checkImovelBelongs"

const uploadImage = multer(uploadConfig.upload("./tmp/imovelImage"))

const imagensRouter = Router()

imagensRouter.post(
    "/:id/imagens",     //id do imovel ao qual a imagem pertence
    verifyAuthorization,
    checkImovelBelongs,
    uploadImage.array("images"),
    imagensController.handleUpload
)
imagensRouter.delete(
    "/:id/imagens",
    verifyAuthorization,
    checkImovelBelongs,
    imagensController.remove
)
imagensRouter.get(
    "/:id/imagens",
    verifyAuthorization,
    checkEdificeExistsAndBelongs,
    imagensController.getAll
)
imagensRouter.patch(
    "/:id/imagens",
    verifyAuthorization,
    checkImovelBelongs,
    uploadImage.single("imagem"),
    imagensController.update
)

export default imagensRouter
