import { ImagemHandle } from "../../services/imagensServices"
import { prismaMock } from "../../../singleton"
import { deleteFile } from "../../utils/file"

jest.mock("../../utils/file", () => ({
    deleteFile: jest.fn(),
}))

describe("Testa remoção de imagem de certo imóvel", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test("deleta imagem caso exista", async () => {
        const mockImage = {
            id: "1123",
            nomeImagem: "image1.jpg",
            createdAt: new Date(),
            updatedAt: new Date(),
            imovelId: "1",
        }
        prismaMock.imagem.findFirst.mockResolvedValue(mockImage)
        prismaMock.imagem.delete.mockResolvedValue(mockImage)

        const result = await ImagemHandle.deleteImage("1", "image1.jpg")

        expect(result).toEqual({
            status: 200,
            message: "imagem deletada",
        })
        expect(prismaMock.imagem.findFirst).toHaveBeenCalledWith({
            where: {
                imovelId: "1",
                nomeImagem: "image1.jpg",
            },
        })
        expect(prismaMock.imagem.delete).toHaveBeenCalledWith({
            where: {
                id: "1123",
            },
        })
        expect(deleteFile).toHaveBeenCalledWith("./tmp/imovelImage/image1.jpg")
    })

    test("retorna erro quando não há imagem para ser deletada", async () => {
        prismaMock.imagem.findFirst.mockResolvedValue(null)

        const result = await ImagemHandle.deleteImage("1", "image1.jpg")

        expect(result).toEqual({
            message: "imagem não encontrada.",
            status: 404,
        })
        expect(prismaMock.imagem.findFirst).toHaveBeenCalledWith({
            where: {
                imovelId: "1",
                nomeImagem: "image1.jpg",
            },
        })
        expect(prismaMock.imagem.delete).not.toHaveBeenCalled()
        expect(deleteFile).not.toHaveBeenCalled()
    })

    test("retorna erro caso a query falhe no banco de dados", async () => {
        const mockError = new Error("Database error")
        prismaMock.imagem.findFirst.mockRejectedValue(mockError)

        const result = await ImagemHandle.deleteImage("1", "image1.jpg")

        expect(result).toEqual({
            message: "falha ao deletar imagem.",
            error: mockError,
            status: 404,
        })
        expect(prismaMock.imagem.findFirst).toHaveBeenCalledWith({
            where: {
                imovelId: "1",
                nomeImagem: "image1.jpg",
            },
        })
        expect(deleteFile).not.toHaveBeenCalled()
    })
})

describe("Testa visualização de imagem de certo imóvel", () => {
    test("retorna imagens quando existem", async () => {
        const mockImage = {
            id: "1123",
            nomeImagem: "image1.jpg",
            createdAt: new Date(),
            updatedAt: new Date(),
            imovelId: "1",
        }
        prismaMock.imagem.findMany.mockResolvedValue([mockImage])

        const result = await ImagemHandle.getImages("1")
        expect(result).toEqual({
            status: 200,
            message: "requisição completa com sucesso",
            imagens: [mockImage],
        })
    })

    test("retorna erro caso a query falhe no banco de dados", async () => {
        const mockError = new Error("Database error")
        prismaMock.imagem.findMany.mockRejectedValue(mockError)

        const result = await ImagemHandle.getImages("1")
        expect(result).toEqual({
            message: "falha ao procurar imagens.",
            error: mockError,
            status: 404,
        })
    })

    test("retorna array vazia quando não há imagens", async () => {
        prismaMock.imagem.findMany.mockResolvedValue([])

        const result = await ImagemHandle.getImages("1")
        expect(result).toEqual({
            status: 200,
            message: "requisição completa com sucesso",
            imagens: [],
        })
    })
})
