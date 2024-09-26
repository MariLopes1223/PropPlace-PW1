import { ImovelBody } from "../model/Imovel";

export function comparaImoveis(
  imovelOld: ImovelBody,
  imovelNew: ImovelBody
): Partial<ImovelBody> {
  const diff: Partial<ImovelBody> = {};

  if (imovelOld.nome !== imovelNew.nome) diff.nome = imovelNew.nome;
  if (imovelOld.latitude !== imovelNew.latitude)
    diff.latitude = imovelNew.latitude;
  if (imovelOld.longitude !== imovelNew.longitude)
    diff.longitude = imovelNew.longitude;
  if (imovelOld.tipo !== imovelNew.tipo) diff.tipo = imovelNew.tipo;
  if (imovelOld.descricao !== imovelNew.descricao)
    diff.descricao = imovelNew.descricao;
  if (imovelOld.disponivel !== imovelNew.disponivel)
    diff.disponivel = imovelNew.disponivel;
  if (imovelOld.preco !== imovelNew.preco) diff.preco = imovelNew.preco;
  if (imovelOld.numInquilinos !== imovelNew.numInquilinos)
    diff.numInquilinos = imovelNew.numInquilinos;

  return diff;
}
