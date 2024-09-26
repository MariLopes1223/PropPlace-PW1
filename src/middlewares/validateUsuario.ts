import validUserSchema from "../utils/usuarioValidadeSchema";
import { NextFunction, Request, Response } from "express";
import { UsuarioBody } from '../model/Usuario';
import { ValidationError } from "yup";

export default {
    new: async (req: Request, res: Response, next: NextFunction) => {
        const schema = validUserSchema.index()
        const data = <UsuarioBody>req.body
        try {
            await schema.validate(data, { abortEarly: false, })
            next()
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ error })
            }
        }
    },
    updated: async (req: Request, res: Response, next: NextFunction) => {
        const schema = validUserSchema.update()
        const data = req.body
        try {
            await schema.validate(data, { abortEarly: false, })
            next()
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ error })
            }
        }
    },
    password: async (req: Request, res: Response, next: NextFunction) => {
        const schema = validUserSchema.password()
        const { senha } = req.body
        try {
            await schema.validate(senha, { abortEarly: false, })
            next()
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(400).json({ error })
            }
        }
    }
}