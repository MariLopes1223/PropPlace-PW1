import { createTransport } from "nodemailer";

const env = process.env;

interface Objeto {
    [key: string]: string
}

const enviarEmail = async (destinatario:string, informacoes:Objeto) => {
    const transportador = createTransport({
        service: "gmail",
        auth: {
          user: env.LOGIN_EMAIL,
          pass: env.SENHA_EMAIL
        }
    });

    const opcoes = modeloSolicitacaoAluguel(destinatario, informacoes);

    try {
        await transportador.sendMail(opcoes);
        return true;
    } catch (erro) {
        console.log(erro);
        return false;
    }
}

const modeloSolicitacaoAluguel = (destinatario:string, informacoes:Objeto) => {
    const conteudo = `
        <h1 class="titulo">Solicitação de aluguel</h1>
        <p class="texto">
            Olá ${informacoes.proprietario}, temos grandes novidades para você! Viemos avisar que você recebeu uma solicitação \
            para alguel do seu imóvel ${informacoes.tipoImovel} com nome "${informacoes.imovel}". Confira as informações abaixo:
        </p>
        <div class="espacador"></div>

        <div class="campos">
            <div class="campo">
                <p class="texto">Inquilina(o)</p>
                <p class="informacao">${informacoes.inquilino}</p>
            </div>

            <div class="campo">
                <p class="texto">Número para contato</p>
                <p class="informacao">${informacoes.contatoFormatado}</p>
            </div>

            <div class="campo">
                <p class="texto">E-mail para contato</p>
                <a href="" class="informacao" style="color: #554348; display: block;">${informacoes.email}</a>
            </div>

            <div class="campo">
                <p class="texto">Quantidade de pessoas</p>
                <p class="informacao">${informacoes.pessoas}</p>
            </div>

            <div class="campo">
                <p class="texto">Período</p>
                <p class="informacao">${informacoes.periodo}</p>
            </div>
        </div>

        <div class="espacador"></div>
        <p class="texto">Entre em contato para responder à solicitação:</p>
        <div class="contato">
            <a href="tel:${informacoes.contato}" class="botao" style="color: #FFFFFF">Ligação</a>
            <a href="https://wa.me/55${informacoes.contato}" class="botao" style="color: #FFFFFF">WhatsApp</a>
            <a href="mailto:${informacoes.email}" class="botao" style="color: #FFFFFF">E-mail</a>
        </div>
    `;

    const html = construcaoCorpoEmail(conteudo);
    const opcoes = {
        from: informacoes.email,
        to: destinatario,
        subject: `Solicitação de aluguel de ${informacoes.imovel}`,
        html
    };

    return opcoes;
}

const construcaoCorpoEmail = (conteudo:string) => {
    return `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperação de senha</title>
            
            <style>
                * { box-sizing: border-box; padding: 0; margin: 0; }
                h1, h2, h3, h4, h5, h6, p, span { color: #554348; }
                a { text-decoration: none; }
                .conteudo { background-color: #E6FFFF; padding-top: 36px; width: 100%; max-width: 600px; margin: auto; }
                .dinamico { padding: 0 12px; }
                .titulo { font-size: 24px; text-align: center; margin-bottom: 36px; }
                .texto { font-size: 16px; text-align: justify; }
                .espacador { height: 36px; }
                .campo { margin-bottom: 24px; }
                .informacao { font-size: 14px; padding: 12px 12px 6px 12px; border-bottom: 1px solid #747578; }
                .contato { display: flex; width: fit-content; margin: auto; }
                .botao { font-size: 16px; color: #FFFFFF; background-color: #554348; border-radius: 12px; padding: 12px; margin: 12px 12px 0 12px; }
                .rodape { display: flex; gap: 36px; background-color: #99BFC6; margin-top: 36px; padding: 12px; }
                .logo { width: 100px; height: 100px; margin-right: 36px; }
                .empresa { font-size: 20px; }
            </style>
        </head>
        <body>
            <div class="conteudo">
                <div class="dinamico">
                    ${conteudo}
                </div>

                <div class="rodape">
                    <img class="logo" src="https://i.ibb.co/Rpn6KWY/icone.png" alt="Logo da PropPlace" border="0">
                    <p class="empresa">PropPlace ©</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export { enviarEmail };
