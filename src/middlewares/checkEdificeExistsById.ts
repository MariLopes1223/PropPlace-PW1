import { NextFunction, Request, Response } from "express"
import { prisma } from "../database/prisma.client"

const erro = {
    message: "imóvel não existe ou não pertence ao usuario",
}

async function checkEdificeExistsAndBelongs(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { id } = req.params
    const { user_id } = req.headers
    const exists = await prisma.imovel.findFirst({
        where: {
            id
        },
    })

    if (!exists || !user_id) {
        return res.status(400).json(erro)
    }
    if (String(user_id) !== exists.userId) {
        return res.status(403).json(erro)
    }
    next()
}

export default checkEdificeExistsAndBelongs
