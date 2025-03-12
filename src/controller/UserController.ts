import { userServices } from "../services/userServices"
import { Request, Response } from "express"
import { enviarEmail } from "../utils/envioDeEmail"

const login = async (req: Request, res: Response): Promise<Response> => {
    const { username, senha } = req.body

    const resp = await userServices.loginUser(username, senha)
  const { status, message, token, userId } = resp
  return res.status(status).json({ message, token, username, userId })
}

const findById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params

    const user = await userServices.findById(id)
    return res.status(200).json(user)
}

const addUser = async (req: Request, res: Response): Promise<Response> => {
    const { nome, username, senha, telefone, email } = req.body

    const resp = await userServices.create(
        nome,
        username,
        senha,
        telefone,
        email
    )
    const { message, error, status } = resp
    return res.status(status).json({ message, error })
}

const listUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await userServices.findAll()

    return res.status(200).json(users)
}

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    // user só pode remover seu prórpio registro
    // portanto, req.headers.user_id = req.params.id

    const resp = await userServices.userDelete(req.params.id)

  return res.status(200).json({ resp })
}

const update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params
    const { user_id } = req.headers
    const { nome, username, telefone, email } = req.body

  if (id !== user_id){
    return res.status(403).json({erro: "não autorizado"})
  }

    const usuario = await userServices.update(
        id,
        nome,
        username,
        telefone,
        email
    )
    return res.status(200).json(usuario)
}

const passwordUpdate = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { id } = req.params
  const { antigaSenha, senha } = req.body
  try {
    const { status, message } = await userServices.passwordUpdate(
      id,
      senha,
      antigaSenha
    )

    return res.status(status).json({ message })
  } catch (error) {
    return res.status(500).json({ error })
  }
};

const findUser = async (req: Request, res: Response) => {
    const { username } = req.params

    const user = await userServices.findByUsername(username)
    return res.status(200).json(user)
}

const enviaEmail = async(req: Request, res: Response) =>{
  const { destinatario, informacoes } = req.body;
  try{
    await enviarEmail(destinatario, informacoes);
    return res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (erro) {
    return res.status(500).json({ error: 'Erro ao enviar email' });
  }
}

const recuperaSenha = async (req: Request, res: Response) => {
  const { email } = req.body
  
  try {
    await userServices.recuperaSenha(email)
    return res.status(200).json({ message: "Email enviado" });
  } catch (error) {
    return res.status(404).json(error)
  }
}

const resetSenha = async (req: Request, res: Response) => {
  const { token } = req.params
  const { senha, senhaRepetida } = req.body
  try {
    await userServices.resetaSenha(token, senha, senhaRepetida)
    return res.status(200).json({ message: "Senha resetada" });
  } catch (error) {
    return res.status(404).json(error)
  }
}
export const UserController = {
    login,
    addUser,
    listUsers,
    deleteUser,
    update,
    passwordUpdate,
    findUser,
    findById,
    enviaEmail,
    recuperaSenha,
    resetSenha
}
