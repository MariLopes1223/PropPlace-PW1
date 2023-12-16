import { userServices } from "../../services/userServices"
import { prismaMock } from "../../../singleton"

describe("userService.findByUsername", () => {
    test("returns user if it exists", async () => {
        const mockUser = {
            id: "1",
            nome: "User",
            username: "user1223",
            senha: "senha123",
            telefone: "12345678910",
            email: "user@1223.com",
            createdAt: new Date(),
            updatedAt: new Date(),
            imoveis: {
                descricao: "Exemplo de descrição",
                disponivel: true,
                id: "123456",
                imagens: {
                    nomeImagem: "exemplo_imagem.jpg",
                },
                latitude: 123.456,
                longitude: -45.678,
                nome: "Nome do Imóvel",
                numInquilinos: 3,
                preco: 1500.0,
                tipo: "Casa",
            },
        }
        prismaMock.usuario.findUnique.mockResolvedValue(mockUser)

        const result = await userServices.findByUsername("user1223")

        expect(result).toEqual(mockUser)

        expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
            where: {
                username: "user1223",
            },
            include: {
                imoveis: {
                    select: {
                        descricao: true,
                        disponivel: true,
                        id: true,
                        imagens: {
                            select: {
                                nomeImagem: true,
                            },
                        },
                        latitude: true,
                        longitude: true,
                        nome: true,
                        numInquilinos: true,
                        preco: true,
                        tipo: true,
                    },
                },
            },
        })
    })
})
