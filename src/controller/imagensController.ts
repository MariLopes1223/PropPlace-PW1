import { Request, Response } from "express";
import { ImagemHandle } from "../services/imagensServices";
import { Imagem } from "../model/Imagem";


const handleUpload = async (req: Request, res: Response) => {
    const imagesRequest = req.files as Express.Multer.File[]

    if(!imagesRequest) {
        return res.status(404).json({error: "Erro relacionado a imagem e upload", imagesRequest})
    }

    const imagesPath = imagesRequest.map((img) => ({ nomeImagem: img.filename })) as unknown as Imagem[]
    const { id } = req.params
    const resp = await ImagemHandle.uploadImg(id, imagesPath)
    const { status, message, imovel } = resp;
    return res.status(status).json({ message, imovel });
}

const remove = async (req: Request, res: Response) => {
    const { id: imovel_id } = req.params //id do imovel
    const { nomeImagem } = req.body //imagem a ser removida do bd e memória
    
    const resp = await ImagemHandle.deleteImage(imovel_id as string, nomeImagem)
    const { status, message } = resp;

    return res.status(status).send({ message })
}

const getAll = async (req: Request, res: Response) => {
    const { id } = req.params //id do imovel
    const resp = await ImagemHandle.getImages(id)
    const { status, message, imagens } = resp;
    return res.status(status).send({ message, imagens })
}

const update = async (req: Request, res: Response) => {
    const { id } = req.params //id do imovel
    const { nomeImagem } = req.body //imagem a ser removida do bd e memória
    const imageRequest = req.file as Express.Multer.File

    const resp = await ImagemHandle.updateImage(id, nomeImagem, imageRequest.filename)
    const { status, message } = resp;

    return res.status(status).send({ message })
}

export default {
    handleUpload,
    getAll,
    update,
    remove
}