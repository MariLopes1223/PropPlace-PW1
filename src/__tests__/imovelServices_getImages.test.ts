import { ImovelHandle } from '../services/imovelServices';
import { prismaMock } from '../../singleton';


describe('ImovelHandle.getImages', () => {
    test('returns images when they exist', async () => {
        const mockImage =
        {
            id: '1123',
            nomeImagem: 'image1.jpg',
            createdAt: new Date(),
            updatedAt: new Date(),
            imovelId: '1',
        }
        prismaMock.imagem.findMany.mockResolvedValue([mockImage]);

        const result = await ImovelHandle.getImages('1');
        expect(result).toEqual({
            status: 200,
            message: "requisição completa com sucesso",
            imagens: [mockImage],
        });
    });

    test('returns error message when database query fails', async () => {
        const mockError = new Error('Database error');
        prismaMock.imagem.findMany.mockRejectedValue(mockError);

        const result = await ImovelHandle.getImages('1');
        expect(result).toEqual({
            message: "falha ao procurar imagens.",
            error: mockError,
            status: 404
        });
    });

    test('returns empty array when no images exist', async () => {
        prismaMock.imagem.findMany.mockResolvedValue([]);

        const result = await ImovelHandle.getImages('1');
        expect(result).toEqual({
            status: 200,
            message: "requisição completa com sucesso",
            imagens: []
        });
    });
});