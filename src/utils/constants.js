const introduction = (reclamante, numeroDoProcesso, reclamada) => `Bom dia, ${reclamante}. No processo trabalhista ${numeroDoProcesso} contra a empresa ${reclamada}, você consta como parte. Confirma essa informação? \n\n Envie "1" para confirmar \n\n Envie "2" caso você não seja essa pessoa`
const confirmation = "Confirmo."
const notFound = "Não sou essa pessoa."
const confirmationText = "Obrigado pela confirmação."
const badEnding = "Pedimos desculpas e agradecemos."
const confirmation2 = "Isso me interessa."
const confirmation3 = "Ainda tenho dúvidas."
const question = `Considerando a fase em que seu processo se encontra, seu direito foi reconhecido e sua causa está ganha, faltando ainda a definição do valor e data de recebimento.`
const question2 = `Tendo em vista que essa etapa pode se estender, saiba que você tem o direito de receber parte desse valor de forma antecipada por meio do crédito consignado em ações trabalhistas.\n\n Envie "1" para confirmar \n\n Envie "2" caso ainda tenha dúvidas.`
const goodEnding = "Nosso consultor entrará em contato o mais brevemente possível. Obrigado."

module.exports = { introduction, confirmation, notFound, confirmationText, badEnding, confirmation2, confirmation3, question, question2, goodEnding }