import { PrismaClient, Prisma } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function getUserData() {
    const senha = await hash('admin321', 5)
    return [
        {
            nome: 'admin',
            email: 'admin@ifpb.com',
            senha,
            telefone: '83912345678',
            username: 'admin123',
            imoveis: {
                create: [
                    {
                        nome: 'imovel teste',
                        descricao: 'testa entidade para fins de desenvolvimento',
                        latitude: -6.731756270678318,
                        longitude: -38.26201521186471,
                        numInquilinos: 1,
                        preco: 500,
                        tipo: 'apartamento',
                    }
                ]
            }
        },
    ]
}

async function main() {
    console.log(`Start seeding ...`)
    for (const u of await getUserData()) {
        const user = await prisma.usuario.create({
            data: u,
        })
        console.log(`Created user with id: ${user.id}`)
    }
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
