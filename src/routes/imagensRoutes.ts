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
    "/:imovelId/imagens",     //id do imovel ao qual a imagem pertence
    verifyAuthorization,
    checkImovelBelongs,
    uploadImage.array("images"),
    imagensController.handleUpload
)
imagensRouter.put(
    "/imagem/user",
    verifyAuthorization,
    uploadImage.single("imagem"),
    imagensController.userImgUpload
)

imagensRouter.delete(
    "/:imovelId/imagens",
    verifyAuthorization,
    checkImovelBelongs,
    imagensController.remove
)
imagensRouter.get(
    "/:imovelId/imagens",
    verifyAuthorization,
    checkEdificeExistsAndBelongs,
    imagensController.getAll
)
imagensRouter.patch(
    "/:imovelId/imagens",
    verifyAuthorization,
    checkImovelBelongs,
    uploadImage.single("imagem"),
    imagensController.update
)

export default imagensRouter
