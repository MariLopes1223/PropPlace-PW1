import { userServices } from "../../services/userServices"
import { prisma } from "../../database/prisma.client"
import { hash } from "bcrypt"
import { app, server } from "../../server"
import request from "supertest"
import { sign } from "jsonwebtoken"
import { v4 as uuid } from "uuid"

describe("Testes de integração para login de usuário", () => {
    const mockImv = {
        id: uuid(),
        nome: 103,
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

    afterAll(async () => {
        await prisma.usuario.delete({
            where: {
                id: mockImv.id,
            },
        })
        await prisma.$disconnect()
        server.close()
    })

    describe("POST /imoveis", () => {
        it("O imovel não deve ser criado com informações inválidas", function (done) {
            request(app)
                .post("/imoveis")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err)
                    return done()
                })
        })
    })
})
