import { prisma } from "../database/prisma.client"
import { Imagem } from "../model/Imagem";
import { deleteFile } from "../utils/file";

export class ImagemHandle {

    static async uploadImg(id: string, imagens: Imagem[]) {
        let imovel
        try {
            imovel = await prisma.imovel.update({
                where: { id },
                data: {
                    imagens: {
                        create: [...imagens]
                    }
                },
                include: { imagens: true }
            });

        } catch (error) {
            return {
                status: 500,
                message: 'Erro interno do servidor!',
                error
            }
        }
        return {
            status: 200,
            message: 'Modificado com sucesso!',
            imovel
        }
    }

    static async uploadUserImg(userId: string, img: Imagem) {
        let user = await prisma.usuario.findFirst({ where: { id: userId }, include: { imagem: true } })
        try {
            if (user?.imagem) {
                user = await prisma.usuario.update({
                    where: { id: userId },
                    data: {
                        imagem: {
                            update: img
                        }
                    },
                    include: { imagem: true }
                });
            } else {
                user = await prisma.usuario.update({
                    where: { id: userId },
                    data: {
                        imagem: {
                            create: img
                        }
                    },
                    include: { imagem: true }
                });
            }

        } catch (error) {
            return {
                status: 500,
                message: 'Erro interno do servidor!',
                error
            }
        }
        return {
            status: 200,
            message: 'Modificado com sucesso!',
            imagem: user.imagem
        }
    }

    static async deleteImage(id_imovel: string, nomeImagem: string) {
        try {
            const img = await prisma.imagem.findFirst({
                where: {
                    imovelId: id_imovel,
                    nomeImagem: nomeImagem
                }
            })

            if (!img) {
                return { message: "imagem não encontrada.", status: 404 }
            }
            await prisma.imagem.delete({
                where: { id: img.id }
            })
            await deleteFile(`./tmp/imovelImage/${nomeImagem}`)

        } catch (error) {
            return { message: "falha ao deletar imagem.", error, status: 404 }
        }

        return {
            status: 200,
            message: "imagem deletada"
        }
    }

    static async getImages(id: string) {
        let imagens
        try {
            imagens = await prisma.imagem.findMany({
                where: { imovelId: id }
            })
        } catch (error) {
            return { message: "falha ao procurar imagens.", error, status: 404 }
        }
        return {
            status: 200,
            message: "requisição completa com sucesso",
            imagens
        }
    }
    static async updateImage(id: string, oldImgFilename: string, newImgFilename: string) {
        const exists = await prisma.imagem.findFirst({
            where: {
                imovelId: id,
                nomeImagem: oldImgFilename
            }
        });
        if (!exists) {
            await deleteFile(`./tmp/imovelImage/${newImgFilename}`)
            return {
                status: 404,
                message: "imagem a ser atualizada não existe"
            };
        }
        await deleteFile(`./tmp/imovelImage/${oldImgFilename}`)

        await prisma.imagem.update({
            where: {
                id: exists.id
            },
            data: {
                nomeImagem: newImgFilename
            }
        })

        return {
            status: 200,
            message: 'Modificado com sucesso!',
        }
    }
}