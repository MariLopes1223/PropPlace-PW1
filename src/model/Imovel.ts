import { Imagem } from "./Imagem";
export interface Imovel extends ImovelBody {
  id: string;
  disponivel: boolean;
}

export interface ImovelDTO extends Imovel {
  imagens?: Imagem[];
}
export interface ImovelBody {
  nome: string;
  latitude: number;
  longitude: number;
  tipo: string;
  descricao: string;
  disponivel?: boolean,
  preco: number;
  numInquilinos: number;
}

export type Coordinates = {
  latitude: number,
  longitude: number
}