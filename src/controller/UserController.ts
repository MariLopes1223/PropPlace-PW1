import { userServices } from "../services/userServices"
import { Request, Response } from "express"

const login = async (req: Request, res: Response): Promise<Response> => {
    const { username, senha } = req.body

    const resp = await userServices.loginUser(username, senha)
    const { status, message, token } = resp
    return res.status(status).json({ message, token })
}

const findId = async (req: Request, res: Response): Promise<Response> => {
    const { username } = req.params

    const id = await userServices.findId(username)
    return res.status(200).json(id)
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
    return res.status(201).json(resp)
}

const listUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await userServices.findAll()

    return res.status(200).json(users)
}

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    // user só pode remover seu prórpio registro
    // portanto, req.headers.user_id = req.params.id

    const resp = await userServices.userDelete(req.params.id)

    return res.status(201).json({resp})
}

const update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params
    const { nome, username, telefone, email } = req.body

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
    const { senha } = req.body

    const resp = await userServices.passwordUpdate(id, senha)
    return res.status(200).json(resp)
}

const findUser = async (req: Request, res: Response) => {
    const { username } = req.params

    const user = await userServices.findByUsername(username)
    return res.status(200).json(user)
}

export const UserController = {
    login,
    addUser,
    listUsers,
    deleteUser,
    update,
    passwordUpdate,
    findUser,
    findId,
}
