import { userServices } from "../../services/userServices"
import { prismaMock } from "../../../singleton"

describe("userServices.findAll", () => {
    test("returns user when they exist", async () => {
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

        prismaMock.usuario.findMany.mockResolvedValue([mockUser])

        const result = await userServices.findAll()

        expect(result).toEqual([mockUser])
    })

    test("returns empty array when no users exist", async () => {
        prismaMock.usuario.findMany.mockResolvedValue([])

        const result = await userServices.findAll()
        expect(result).toEqual([])
    })
})
