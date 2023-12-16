import { userServices } from "../../services/userServices"
import { prisma } from "../../database/prisma.client"
import { hash } from "bcrypt"
import { app, server } from "../../server"
import request from "supertest"
import { sign } from "jsonwebtoken"

describe("Testes de integração para login de usuário", () => {
    const mockUserData = {
        nome: "User",
        username: "user1223",
        senha: "senha123",
        telefone: "12345678910",
        email: "user@1223.com",
    }
    let token: string
    beforeAll(async () => {
        await prisma.usuario.create({
            data: {
                id: "1",
                ...mockUserData,
                senha: await hash("senha123", 5),
            },
        })
        const user = { name: mockUserData.username }
        token = sign(user, process.env.SECRET as string, {
            subject: "1",
        })
    })

    afterAll(async () => {
        await prisma.usuario.delete({
            where: {
                id: "1",
            },
        })
        await prisma.$disconnect()
        server.close()
    })

    it("Deve autenticar um usuário existente e retornar um token", async () => {
        const { username, senha } = mockUserData
        const token = await userServices.loginUser(username, "senha123")
        expect(token).toBeDefined()
    })

    it("Deve retornar uma mensagem de erro para um usuário inexistente", async () => {
        const { username } = mockUserData
        const senha = "senha"
        const result = await userServices.loginUser(username, senha)
        expect(result).toEqual({
            message: "Usuário não existe",
            status: 401,
            token: null,
        })
    })

    describe("GET /users", () => {
        it("resposta para requisição listar todos recebida com status 200", function (done) {
            request(app)
                .get("/users")
                .auth(token, { type: "bearer" })
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err)
                    return done()
                })
        })
        it("resposta rejeitada para token inválido", async () => {
            const { body } = await request(app)
                .get("/users")
                .auth("tokeninvalido", { type: "bearer" })
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(403)
            expect(body.message).toBe("token invalid")
        })
    })
    describe("POST /users", () => {
        it("deve responder com status code 200 para requisição com dados válidos", async () => {
            const { status, body } = await request(app)
                .post("/users")
                .set("Accept", "application/json")
                .send({
                    nome: "fulano",
                    username: "testusername",
                    senha: "testpassword",
                    telefone: "12345678910",
                    email: "a@b.com",
                })
            expect(status).toBe(201)
            expect(body.message).toBe("Usuário cadastrado com sucesso!")
            const usuario = await prisma.usuario.findFirst({
                where: { username: "testusername" },
            })
            expect(usuario).not.toBeNull()
        })
        it("deve responder com status code 400 para requisição de registro com senha inválida", async () => {
            const { status, body } = await request(app)
                .post("/users")
                .set("Accept", "application/json")
                .send({
                    nome: "fulano",
                    username: "testusername",
                    senha: "aaa", //senha deve ter 8 caracteres ao menos
                    telefone: "12345678910",
                    email: "a@b.com",
                })
            expect(status).toBe(400)
            expect(body.error).not.toBeNull()
        })
    })
})
