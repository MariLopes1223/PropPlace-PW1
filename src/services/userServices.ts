import { v4 as uuid } from "uuid"
import { prisma } from "../database/prisma.client"
import { Usuario } from "../model/Usuario"
require("dotenv").config()
import { compare, hash } from "bcrypt"
import { sign } from "jsonwebtoken"

const loginUser = async (username: string, senha: string) => {
    const userExist = await prisma.usuario.findUnique({
        where: {
            username,
        },
    })
    if (!userExist) {
        return {
            message: "Username ou senha inválido",
            status: 401,
            token: null,
        }
    }

    const verifica = await compare(senha, userExist.senha)

    if (!verifica) {
        return {
            message: "Username ou senha inválidos",
            status: 401,
            token: null,
        }
    }
    const user = { name: username }
    const token = sign(user, process.env.SECRET as string, {
        expiresIn: "5h",
        subject: userExist.id,
    })
    return { token: token, status: 200, message: "sucesso" }
}

const create = async (
    nome: string,
    username: string,
    senha: string,
    telefone: string,
    email: string
) => {
    const user = await prisma.usuario.findUnique({
        where: {
            username,
        },
    })
    if (user) {
        return { message: "Usuario já existe" }
    }

    const senhaCriptografada = await hash(senha, 5)
    try {
        await prisma.usuario.create({
            data: {
                id: uuid(),
                nome,
                username,
                senha: senhaCriptografada,
                telefone,
                email,
                imoveis: {},
            },
        })
    } catch (error) {
        return { message: "Alguma restrição do banco de dados violada", error }
    }

    return { message: "Usuário cadastrado com sucesso!" }
}

const findAll = async (): Promise<Usuario[]> => {
    const users = await prisma.usuario.findMany({
        include: {
            imoveis: {
                select: {
                    id: true,
                    nome: true,
                    latitude: true,
                    longitude: true,
                    tipo: true,
                    descricao: true,
                    preco: true,
                    disponivel: true,
                    numInquilinos: true,
                    imagens: {
                        select: {
                            nomeImagem: true,
                        },
                    },
                },
            },
        },
    })
    return users
}

const userDelete = async (id: string) => {
    await prisma.usuario
        .delete({
            where: {
                id,
            },
        })
        .catch((error) => ({ message: "Database error", error }))
    return { message: "Usuário removido com sucesso" }
}

const update = async (
    id: string,
    nome: string,
    username: string,
    telefone: string,
    email: string
) => {
    const oldUser = await prisma.usuario.findUnique({
        where: {
            username,
        },
    })
    if (oldUser) {
        return { message: "Usuario já existe" }
    }

    const userNew = await prisma.usuario.update({
        where: {
            id,
        },
        data: {
            nome,
            username,
            telefone,
            email,
        },
    })

    return userNew
}

const passwordUpdate = async (id: string, senha: string) => {
    const senhaCriptografada = await hash(senha, 5)
    await prisma.usuario.update({
        where: {
            id,
        },
        data: {
            senha: senhaCriptografada,
        },
    })
    return { message: "Senha atualizada com sucesso!" }
}

const findId = async (username: string) => {
    const user = await prisma.usuario.findUnique({
        where: {
            username,
        },
    })
    if (!user) {
        return { message: "Usuário não encontrado" }
    }
    return user.id
}

const findByUsername = async (username: string) => {
    const user = await prisma.usuario.findUnique({
        where: {
            username,
        },
        include: {
            imoveis: {
                select: {
                    id: true,
                    nome: true,
                    latitude: true,
                    longitude: true,
                    tipo: true,
                    descricao: true,
                    preco: true,
                    disponivel: true,
                    numInquilinos: true,
                    imagens: {
                        select: {
                            nomeImagem: true,
                        },
                    },
                },
            },
        },
    })
    if (!user) {
        return { message: "Usuário não encontrado" }
    }
    return user
}

export const userServices = {
    loginUser,
    findId,
    create,
    findAll,
    userDelete,
    update,
    passwordUpdate,
    findByUsername,
}
