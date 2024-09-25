import { Request, Response } from "express"
import { ImovelHandle } from "../services/imovelServices"
import { Coordinates, ImovelBody } from "../model/Imovel"

export class ImovelController {
    static async add(req: Request, res: Response) {
        if (req.headers.user_id) {
            const resp = await ImovelHandle.create(
                req.body as ImovelBody,
                req.headers.user_id as string
            )
            const { message, status, imovel } = resp
            return res.status(status).json({ message, imovel })
        }
        return res.status(400).json({ error: "bad request" })
    }

    static async update(req: Request, res: Response) {
        const { id: idImovel } = req.params

        const resposta = await ImovelHandle.update(
          req.body as ImovelBody,
          idImovel
        );
        const { message, status, imovel, error } = resposta;
        if (error) return res.status(status).json({ message, error });

        return res.status(status).json({ message, imovel });
    }

    static async list(req: Request, res: Response) {
        const resp = await ImovelHandle.list()

        return res.status(200).json(resp)
    }

    static async findByOwner(req: Request, res: Response) {
        const ownerId = req.query.id ? req.query.id : req.headers.user_id 
        const { error, status, imoveis } = await ImovelHandle.findByUserId(
          ownerId as string
        )
        if (error) return res.status(status).json(error);

        return res.status(status).json({ imoveis });
    }

    static async findByType(req: Request, res: Response) {
        const { tipo } = req.params as { tipo: string }

        const resp = await ImovelHandle.findByType(tipo)

        res.status(200).json(resp)
    }

    static async findByName(req: Request, res: Response) {
        const { nome } = req.params as { nome: string }

        const resp = await ImovelHandle.findByName(nome)

        res.status(200).json(resp)
    }

    static async findByLocale(req: Request, res: Response) {
        const coords = req.body as Coordinates
        const radius = Number(req.params.radius)
        if (isNaN(radius)) {
            res.status(400).send({ error: "Radius must be a number" })
            return
        }
        const resp = await ImovelHandle.findByLocale(coords, radius)
        if (resp.imoveis.length === 0) {
            return res.status(404).json({
                message: `nenhum imóvel encontrado num raio de ${radius}Km`,
            })
        }
        res.status(resp.status).json(resp.imoveis)
    }

    static async updateName(req: Request, res: Response) {
        const { nome } = req.body
        const { id } = req.params

        const resp = await ImovelHandle.updateName(nome, id)

        res.status(resp.status).json(resp.message)
    }

    static async updateLocale(req: Request, res: Response) {
        const { id } = req.params

        const resp = await ImovelHandle.updateLocale(req.body, id)

        res.status(resp.status).json(resp.message)
    }

    static async updateAvailability(req: Request, res: Response) {
        const { disponivel } = req.body as { disponivel: boolean }
        const { id } = req.params

        const resp = await ImovelHandle.updateAvailability(disponivel, id)
        const { message, status } = resp
        res.status(status).json({ message })
    }

    static async delete(req: Request, res: Response) {
        const { id } = req.params

        const resp = await ImovelHandle.delete(id)
        const { status, message } = resp
        return res.status(status).json({message})
    }
}
