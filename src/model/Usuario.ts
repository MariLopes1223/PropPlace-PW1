import { Imagem } from "./Imagem";

export interface Usuario extends UsuarioBody {
  id: string;
}

export type UsuarioBody = {
  nome: string;
  username: string;
  senha: string;
  telefone: string;
  email: string;
};

export type UsuarioResp = Usuario & {
  imagem: Imagem;
};
