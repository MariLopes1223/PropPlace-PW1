import { Request, Response } from "express"
import { userServices } from "../services/userServices";
import { ImovelHandle } from "../services/imovelServices";

const getInfoHome = async (req: Request, res: Response): Promise<Response> => {
    let users = await userServices.findAll();

    users = users.map((usuario => ({
        ...usuario,
        ocupacao: Array.isArray(usuario.imoveis) && usuario.imoveis.length > 0 
        ? "Proprietário" 
        : "Inquilino"
    })))

    let imoveis = await ImovelHandle.list();

    return res.status(201).json({users, imoveis});
}

export const homeController = {
    getInfoHome,
}