import { Request, Response, NextFunction } from "express"

export const checkUserIsAllowed = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // usuário autenticado só pode alterar (update, delete) 
    // a si próprio
    if (req.headers.user_id !== req.params.id) {
        return res.status(403).json({ message: "Forbidden" })
    }
    else return next()
}
