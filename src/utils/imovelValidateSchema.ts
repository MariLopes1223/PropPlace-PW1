import * as Yup from 'yup';

const validImovelSchema = {
    index: () => {
        return Yup.object().shape({
            nome: Yup.string().required('Error: nome deve ser obrigatório'),
            latitude: Yup.number()
                .required('Error: latitude deve ser obrigatório')
                .min(-90, 'Error: latitude deve ser no mínimo -90')
                .max(90, 'Error: latitude deve ser no máximo +90'),
            longitude: Yup.number()
                .required('Error: longitude deve ser obrigatório')
                .min(-180, 'Error: longitude deve ser no mínimo -180')
                .max(180, 'Error: longitude deve ser no máximo +180'),
            tipo: Yup.string().required('Error: tipo deve ser obrigatório'),
            descricao: Yup.string().required('Error: descricao deve ser obrigatório'),
            preco: Yup.number().required('Error: preço deve ser obrigatório')
                .moreThan(0, 'Erro: preço deve ser maior que zero')
            ,
            numInquilinos: Yup.number().required('Error: numero de inquilinos deve ser obrigatório')
                .min(0, 'Erro: numero de inquilinos não deve ser negativo')
                .integer('Erro: numero de inquilinos deve ser um numero inteiro'),
            disponivel: Yup.boolean().default(true)
        })
    },
    nome: () => {
        return Yup.string().required('Error: nome deve ser obrigatório')
    },
    coordinates: () => {
        return Yup.object().shape({
            latitude: Yup.number()
                .required('Error: latitude deve ser obrigatório')
                .min(-90, 'Error: latitude deve ser no mínimo -90')
                .max(90, 'Error: latitude deve ser no máximo +90'),
            longitude: Yup.number()
                .required('Error: longitude deve ser obrigatório')
                .min(-180, 'Error: longitude deve ser no mínimo -180')
                .max(180, 'Error: longitude deve ser no máximo +180')
        })
    },
    disponivel: () => {
        return Yup.boolean().required("Error: disponibilidade deve estar especificada")
    }
}
export default validImovelSchema