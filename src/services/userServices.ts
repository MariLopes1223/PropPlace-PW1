import { Request, Response } from "express";
import { v4 as uuid} from "uuid";
import { prisma } from "../database/repositoryUser";
import { Usuario } from "../model/Usuario";
const jwt = require('jsonwebtoken');


const create = async (nome:string, username: string, senha: string, telefone: string, email: string) => {
    const user = await prisma.usuario.findUnique({
        where:{
            username
        }
    })
    if(user){
        return {message: "usuario já existe"};
    }
    const userNew = await prisma.usuario.create({
        data:{
            id: uuid(),
            nome,
            username,
            senha,
            telefone,
            email,
            imoveis:{}
        }
    })

    const token = jwt.sign(userNew, userNew.senha, { expiresIn: '1d' });
    console.log('Token criado:', token);
}

const findAll = async (): Promise<Usuario[]> => {
    const users = await prisma.usuario.findMany({
        include:{
            imoveis:{
                select:{
                    id: true,
                    nome: true,
                    latitude: true,
                    longitude: true,
                    tipo: true,
                    descricao: true,
                    preco: true,
                    disponivel: true,
                    avaliacao: true,
                    numInquilinos: true,
                    imagens:{
                        select:{
                            nomeImagem: true,
                        }
                    }
                }
            }
        }
    })
    console.log(users);
    return users;
}

const userDelete = async (id: string):Promise<void> => {
    const user = await prisma.usuario.delete({
        where:{
            id
        }
    })
}



export const userServices = {
    create,
    findAll,
    userDelete,
    // findByUsername,
    // findById
}