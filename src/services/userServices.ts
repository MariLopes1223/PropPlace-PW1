import { v4 as uuid } from "uuid"
import { prisma } from "../database/prisma.client"
import { Usuario, UsuarioResp } from "../model/Usuario"
require("dotenv").config()
import { compare, hash } from "bcrypt"
import { sign } from "jsonwebtoken"
import { randomUUID } from "crypto"
import { enviarEmailRecuperaSenha, IPassRecovery } from "../utils/envioDeEmail"

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
  return { token: token, status: 200, userId: userExist.id }
}

const create = async (
    nome: string,
    username: string,
    senha: string,
    telefone: string,
    email: string
) => {
    const user = await prisma.usuario.findFirst({
        where: {
      OR: [{ username: username }, { email: email }],
        },
    })
    if (user) {
        return { message: "Usuario já existe", status: 409}
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
        return { message: "Alguma restrição do banco de dados violada", error, status: 400 }
    }

    return { message: "Usuário cadastrado com sucesso!", status: 201 }
}

const findAll = async (): Promise<UsuarioResp[]> => {
    const users = await prisma.usuario.findMany({ 
        select: {
            id: true,
            nome: true,
            username: true,
            telefone: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            imagem: { select: {
                nomeImagem: true,
                createdAt: true,
                updatedAt: true,
            }},
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
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                },
            },
        },
    })
    return users as unknown as UsuarioResp[]
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
        include: { imagem: true }
    })

    return userNew
}

const passwordUpdate = async (
  id: string,
  senha: string,
  antigaSenha: string
) => {
  const userExists = await prisma.usuario.findUnique({
    where: {
      id,
    },
  });

  if (!userExists) {
    return {
      status: 401,
      message: "usuario nao existe"
    };
  }

  const verifica = await compare(antigaSenha, userExists.senha);

  if (!verifica) {
    return {
      message: "Senha incorreta",
      status: 401,
    };
  }

    await prisma.usuario.update({
        where: {
            id,
        },
        data: {
      senha: await hash(senha, 5),
        },
    })
    return { message: "Senha atualizada com sucesso!", status: 200 }
}

const findById = async (id: string) => {
    const user = await prisma.usuario.findUnique({
        where: {
            id,
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
            imagem:{
                select:{
                    nomeImagem: true,
                },
            },
        },

    })
    if (!user) {
        return { message: "Usuário não encontrado" }
    }
    return user
}

const findByUsername = async (username: string) => {
    const user = await prisma.usuario.findFirst({
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
            imagem:{
                select:{
                    nomeImagem: true,
                },
            },
        },
    })
    if (!user) {
        return { message: "Usuário não encontrado" }
    }
    return user
}

const recuperaSenha = async ({nome, username, email} : IPassRecovery) => {
  const user = await prisma.usuario.findFirstOrThrow({
    select: { nome: true, username: true, email: true },
    where: { email },
  });

  const senha = randomUUID() 
  const senhaEncrypt = await hash(senha, 5)

  await prisma.usuario.update({
    where: { username },
    data: { senha: senhaEncrypt },
  });

  const enviou = await enviarEmailRecuperaSenha({ email, nome, username, novaSenha: senha });

  if (enviou) {
    console.log("show");
    return
  }
  
   throw new Error("não enviou. paia :(");
}

export const userServices = {
    loginUser,
    findById,
    create,
    findAll,
    userDelete,
    update,
    passwordUpdate,
    recuperaSenha,
    findByUsername,
}
