import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { prisma } from "./src/database/prisma.client";

jest.mock('./src/database/prisma.client', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})
afterEach(() => {
  prisma.imagem.deleteMany()
  prisma.imovel.deleteMany()
  prisma.usuario.deleteMany()
  jest.clearAllMocks()
})
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
