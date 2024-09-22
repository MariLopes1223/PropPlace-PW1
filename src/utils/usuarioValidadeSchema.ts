import * as Yup from 'yup';

const validUserSchema = {
    index: () => {
        return Yup.object().shape({
            nome: Yup.string()
                .required('Error: nome deve ser obrigatório'),
            username: Yup.string()
                .required('Erro: username é obrigatório'),
            senha: Yup.string()
                .min(8, 'Error: senha deve ter pelo menos 8 caracteres')
                .required('Error: senha é obrigatória'),
            telefone: Yup.string()
                .matches(/^[0-9]+$/, 'Error: telefone deve conter apenas números')
                .required('Error: telefone é obrigatório')
                .length(11, 'Error: telefone deve ter exatamente 11 dígitos'),
            email: Yup.string()
                .email('Error: email inválido')
                .required('Error: email é obrigatório')
        })
    },
    password: () => {
        return Yup.string()
        .min(8, 'Error: senha deve ter pelo menos 8 caracteres')
        .required('Error: senha é obrigatória')
    },
    update: () => {
        return Yup.object().shape({
            nome: Yup.string(),
            username: Yup.string(),
            telefone: Yup.string()
                .matches(/^[0-9]+$/, 'Error: telefone deve conter apenas números')
                .length(11, 'Error: telefone deve ter exatamente 11 dígitos'),
            email: Yup.string()
                .email('Error: email inválido')
        })
    }
}

export default validUserSchema