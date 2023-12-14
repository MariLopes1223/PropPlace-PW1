import { ImovelHandle } from "../../services/imovelServices"
import { v4 as uuid } from "uuid"
import { prismaMock } from "../../../singleton"
import { Coordinates, Imovel } from "../../model/Imovel"

describe("ImovelHandle", () => {
    const mockImovel = {
        id: uuid(),
        nome: "casa 103",
        latitude: -6.87,
        longitude: 38.58,
        tipo: "casa",
        descricao: "casa proximo ao regional",
        preco: 7000,
        disponivel: true,
        numInquilinos: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "1",
    }
    afterEach(() => {
        jest.clearAllMocks()
    })

    test("criar imovel", async () => {
        prismaMock.imovel.create.mockResolvedValueOnce(mockImovel)

        const resp = await ImovelHandle.create(mockImovel)

        expect(resp.message).toEqual("Imovel cadastrado com sucesso")
    })

    test("buscar pelas coordenadas", async () => {
        const mockImovel = {
            id: uuid(),
            nome: "casa 103",
            latitude: -6.87,
            longitude: 38.58,
            tipo: "casa",
            descricao: "casa proximo ao regional",
            preco: 7000,
            disponivel: true,
            numInquilinos: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "1",
        }

        prismaMock.imovel.findMany.mockResolvedValueOnce([mockImovel])

        const resp = await ImovelHandle.findByLocale(
            { latitude: -6.87, longitude: 38.58 } as Coordinates,
            1
        )

        expect(resp.message).toEqual([mockImovel])
    })

    test("renomear", async () => {
        const mockImovel = {
            id: uuid(),
            nome: "casa 103",
            latitude: -6.87,
            longitude: 38.58,
            tipo: "casa",
            descricao: "casa proximo ao regional",
            preco: 7000,
            disponivel: true,
            numInquilinos: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "1",
        }

        prismaMock.imovel.findUnique.mockResolvedValue(null)
        prismaMock.imovel.update.mockResolvedValue(mockImovel)

        const resp = await ImovelHandle.updateName("casa 12345", mockImovel.id)

        expect(resp.message).toEqual("Nomeado com sucesso!")
    })

    test("deletar", async () => {
        const mockImovel = {
            id: uuid(),
            nome: "casa 103",
            latitude: -6.87,
            longitude: 38.58,
            tipo: "casa",
            descricao: "casa proximo ao regional",
            preco: 7000,
            disponivel: true,
            numInquilinos: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "1",
        }

        prismaMock.imovel.findUnique.mockResolvedValue(mockImovel)
        prismaMock.imovel.delete.mockResolvedValue(mockImovel)

        const resp = await ImovelHandle.delete(mockImovel.id)

        expect(resp.message).toEqual("Imovel removido com sucesso")
    })
})
