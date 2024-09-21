import { prisma } from "../database/prisma.client"
import { ImovelBody } from "../model/Imovel"
import { Coordinates } from "../model/Imovel"
import { comparaImoveis } from "../utils/comparaImoveis"
import { deleteFile } from "../utils/file"

export class ImovelHandle {
    static async create(infos: ImovelBody, user_id: string) {
        try {
            await prisma.usuario
                .update({
                    where: { id: user_id },
                    data: {
                        imoveis: {
                            create: [infos],
                        },
                    },
                })
        } catch (error) {
            return { message: "database error", error, status: 400 }
        } 
        const newImovel = await prisma.imovel.findFirstOrThrow({
          where: infos,
          include: {
            imagens: {
              select: { nomeImagem: true, createdAt: true, updatedAt: true },
            },
          },
        });
        return {
            status: 201,
            message: "Imovel cadastrado com sucesso",
            imovel: newImovel
        }
    }
    static async update(infos: ImovelBody, idImovel: string) {
        try {
          const imovelOld = await prisma.imovel.findFirst({
            where: { id: idImovel },
          });
          const camposAtualizados = comparaImoveis(
            imovelOld as ImovelBody,
            infos
          );
          const imovelAtt = await prisma.imovel.update({
            where: {
              id: idImovel,
            },
            data: {
              ...camposAtualizados,
            },
            include: { imagens: true },
          });
          return {
            status: 201,
            message: "Imovel atualizado com sucesso",
            imovel: imovelAtt,
          };
        } catch (error) {
          return { message: "Bad request", status: 400, error };
        }
    }

    static async list() {
        const imoveis = await prisma.imovel.findMany({ 
            include: { imagens: { select: 
                { 
                    id: true, createdAt: true, updatedAt: true, nomeImagem: true 
                } } }
        }
        ).catch((error) => {
            return { message: "database error", error }
        })
        
        return imoveis
    }

    static async findByName(nome: string) {
        const imoveis = await prisma.imovel.findMany({
            where: {
                nome,
            },
            include: { imagens: true }
        })
        return imoveis
    }

    static async findByType(tipo: string) {
        const imoveis = await prisma.imovel.findMany({
            where: {
                tipo,
            },
            include: { imagens: true }
        })
        return imoveis
    }

    static async findByLocale(coords: Coordinates, radius: number) {
        const imoveis = await prisma.imovel.findMany({
            include: { imagens: true }
        })
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
    
    static async findByUserId(userId: string) {
        let imoveis
        try {
            imoveis = await prisma.imovel.findMany({
                where: { userId },
                include: { imagens: {
                    select: {
                        nomeImagem: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                }}
            })
            
        } catch (error) {
            return { error, status: 404 }
        }
        return { imoveis, status: 200 }
    }

    static async updateName(nome: string, id: string) {
        const imovel = await prisma.imovel.update({
            where: { id },
            data: {
                nome,
            },
            include: { imagens: true }
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
            include: { imagens: true }
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
            include: { imagens: true }
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
