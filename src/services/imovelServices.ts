import { prisma } from "../database/prisma.client"
import { ImovelBody } from "../model/Imovel"
import { Coordinates } from "../model/Imovel"
import { deleteFile } from "../utils/file"

export class ImovelHandle {
    static async create(infos: ImovelBody, user_id: string) {
        const imoveis = await prisma.usuario
            .update({
                where: { id: user_id },
                data: {
                    imoveis: {
                        create: [infos],
                    },
                },
                include: { imoveis: true },
            })
            .catch((error) => {
                return { message: "database error", error }
            })

        return {
            status: 201,
            message: "Imovel cadastrado com sucesso",
        }
    }

    static async list() {
        const imoveis = await prisma.imovel.findMany().catch((error) => {
            return { message: "database error", error }
        })
        return imoveis
    }

    static async findByName(nome: string) {
        const imoveis = await prisma.imovel.findMany({
            where: {
                nome,
            },
        })
        return imoveis
    }

    static async findByType(tipo: string) {
        const imoveis = await prisma.imovel.findMany({
            where: {
                tipo,
            },
        })
        return imoveis
    }

    static async findByLocale(coords: Coordinates, radius: number) {
        const imoveis = await prisma.imovel.findMany()
        const filtered = imoveis.filter((imovel) =>
            isWithin(
                { longitude: imovel.longitude, latitude: imovel.latitude },
                coords,
                radius
            )
        )

        return {
            status: 200,
            message: filtered,
        }
    }
    //U
    static async updateName(name: string, id: string) {
        const imovel = await prisma.imovel.update({
            where: { id },
            data: {
                nome: name,
            },
        })

        return {
            status: 200,
            message: "Nomeado com sucesso!",
        }
    }

    static async updateLocale(
        coords: { latitude: number; longitude: number },
        id: string
    ) {
        const imovel = await prisma.imovel.update({
            where: { id },
            data: {
                latitude: coords.latitude,
                longitude: coords.longitude,
            },
        })

        return {
            status: 200,
            message: "Modificado com sucesso!",
        }
    }

    static async updateAvailability(mod: boolean, id: string) {
        const imovel = await prisma.imovel.update({
            where: { id },
            data: {
                disponivel: mod,
            },
        })

        return {
            status: 200,
            message: "Modificado com sucesso!",
        }
    }
    //D
    static async delete(id: string) {
        await prisma.imovel
            .findFirst({
                where: {
                    id,
                },
                include: { imagens: true },
            })
            .then((imovel) => {
                if (imovel?.imagens) {
                    imovel?.imagens.map(async (img) => {
                        await deleteFile(`./tmp/imovelImage/${img.nomeImagem}`)
                    })
                }
            })
            .catch((error) => ({ error }))
        await prisma.imovel.delete({ where: { id } })

        return {
            status: 200,
            message: "Imovel removido com sucesso",
        }
    }
}

export function isWithin(
    point: Coordinates,
    center: Coordinates,
    radiusKm: number
): boolean {
    function toRadians(degrees: number): number {
        return degrees * (Math.PI / 180)
    }

    const earthRadius = 6371
    const dLat = toRadians(point.latitude - center.latitude)
    const dLon = toRadians(point.longitude - center.longitude)

    const a = // formula de Haversine para calcular distância entre dois pontos em esfera
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(center.latitude)) *
            Math.cos(toRadians(point.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = earthRadius * c

    return distance <= radiusKm
}
