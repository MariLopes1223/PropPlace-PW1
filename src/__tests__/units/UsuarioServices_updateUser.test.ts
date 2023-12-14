import { userServices } from "../../services/userServices"
import { prismaMock } from "../../../singleton"

describe("userServices.update", () => {
    test("returns the update of a user when it exists", async () => {
        const mockUser2 = {
            id: "1",
            nome: "User2",
            username: "user122",
            senha: "senha123",
            telefone: "12345678911",
            email: "user2@1223.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        prismaMock.usuario.findUnique.mockResolvedValue(null)
        prismaMock.usuario.update.mockResolvedValue(mockUser2)

        const result = await userServices.update(
            "1",
            "User2",
            "user122",
            "12345678911",
            "user2@1223.com"
        )

        expect(result).toEqual(mockUser2)

        expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
            where: {
                username: "user122",
            },
        })

        expect(prismaMock.usuario.update).toHaveBeenCalledWith({
            where: {
                id: "1",
            },
            data: {
                nome: "User2",
                username: "user122",
                telefone: "12345678911",
                email: "user2@1223.com",
            },
        })
    })

    test("returns error message when username is already in use", async () => {
        const mockUser2 = {
            id: "1",
            nome: "User2",
            username: "user122",
            senha: "senha123",
            telefone: "12345678911",
            email: "user2@1223.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        prismaMock.usuario.findUnique.mockResolvedValue(mockUser2)

        const result = await userServices.update(
            "1",
            "User2",
            "user122",
            "12345678911",
            "user2@1223.com"
        )

        expect(result).toEqual({ message: "Usuario já existe" })

        expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
            where: {
                username: "user122",
            },
        })

        expect(prismaMock.usuario.update).not.toHaveBeenCalled()
    })
})
