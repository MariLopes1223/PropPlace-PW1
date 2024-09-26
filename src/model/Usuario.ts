import { Imagem } from "./Imagem";
import { ImovelDTO } from "./Imovel";

type UsuarioMinimo = {
  nome: string;
  username: string;
  telefone: string;
  email: string;
};

export type UsuarioBody = UsuarioMinimo & {
  senha: string;
};

export interface Usuario extends UsuarioBody {
  id: string;
}

export type UsuarioResp = UsuarioMinimo & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  imoveis: ImovelDTO
  imagem?: Imagem;
};
