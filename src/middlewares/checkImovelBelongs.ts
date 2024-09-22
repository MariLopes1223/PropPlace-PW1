import { NextFunction, Request, Response } from "express";
import { prisma } from "../database/prisma.client";

//*middleware*//

export const checkImovelBelongs = async (req: Request, res: Response, next: NextFunction) => {
    const imovel_id = req.params.imovelId as string
    const user_id = req.headers.user_id as string

    const userOwnsImovel = await prisma.imovel.findFirst({
        where: {
            id: imovel_id,
            userId: user_id
        }
    }).catch(error => {
        return res.status(500).json(error)
    })

    if (!userOwnsImovel) {
        return res.status(403).json({ error: "Usuário não autorizado a modificar imóvel" });
    }

    next();
}