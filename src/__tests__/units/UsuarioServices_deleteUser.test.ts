import { userServices } from "../../services/userServices"
import { prismaMock } from "../../../singleton"

describe("userServices.userDelete", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test("deletes user when it exists", async () => {
        const mockUser = {
            id: "1",
            nome: "User",
            username: "user1223",
            senha: "senha123",
            telefone: "12345678910",
            email: "user@1223.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        prismaMock.usuario.findUnique.mockResolvedValue(mockUser)
        prismaMock.usuario.delete.mockResolvedValue(mockUser)

        const result = await userServices.userDelete("1")

        expect(result).toEqual({
            message: "Usuário removido com sucesso",
        })

        expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
            where: {
                id: "1",
            },
        })

        expect(prismaMock.usuario.delete).toHaveBeenCalledWith({
            where: {
                id: "1",
            },
        })
    })

    test("returns error message when user is not found", async () => {
        prismaMock.usuario.findUnique.mockResolvedValue(null)

        const result = await userServices.userDelete("1")

        expect(result).toEqual({
            message: "Usuário não existe",
        })
        expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
            where: {
                id: "1",
            },
        })
        expect(prismaMock.usuario.delete).not.toHaveBeenCalled()
    })
})
