import { Request, Response } from "express";
import { ImagemHandle } from "../services/imagensServices";
import { Imagem } from "../model/Imagem";


const handleUpload = async (req: Request, res: Response) => {
    const imagesRequest = req.files as Express.Multer.File[]

    if(!imagesRequest) {
        return res.status(404).json({error: "Erro relacionado a imagem e upload", imagesRequest})
    }

    const imagesPath = imagesRequest.map((img) => ({ nomeImagem: img.filename })) as unknown as Imagem[]
    const { imovelId } = req.params
    const resp = await ImagemHandle.uploadImg(imovelId, imagesPath)
    const { status, message, imovel } = resp;
    return res.status(status).json({ message, imovel });
}

const userImgUpload = async (req: Request, res: Response) => {
    const imageRequest = req.file as Express.Multer.File
    console.log(req.file as Express.Multer.File)
    const userId = req.headers.user_id
    if(!imageRequest) {
        return res.status(404).json({error: "Erro relacionado a imagem e upload", imageRequest})
    }

    const imagePath = { nomeImagem: imageRequest.filename } as Imagem
    const resp = await ImagemHandle.uploadUserImg(userId as string, imagePath)
    const { status, message, imagem } = resp;
    return res.status(status).json({ message, imagem });
}

const remove = async (req: Request, res: Response) => {
    const { imovelId } = req.params //id do imovel
    const { nomeImagem } = req.body //imagem a ser removida do bd e memória
    
    const resp = await ImagemHandle.deleteImage(imovelId as string, nomeImagem)
    const { status, message } = resp;

    return res.status(status).send({ message })
}

const getAll = async (req: Request, res: Response) => {
    const { imovelId } = req.params //id do imovel
    const resp = await ImagemHandle.getImages(imovelId)
    const { status, message, imagens } = resp;
    return res.status(status).send({ message, imagens })
}

const update = async (req: Request, res: Response) => {
    const { imovelId } = req.params //id do imovel
    const { nomeImagem } = req.body //imagem a ser removida do bd e memória
    const imageRequest = req.file as Express.Multer.File

    const resp = await ImagemHandle.updateImage(imovelId, nomeImagem, imageRequest.filename)
    const { status, message } = resp;

    return res.status(status).send({ message })
}

export default {
    handleUpload,
    userImgUpload,
    getAll,
    update,
    remove
}