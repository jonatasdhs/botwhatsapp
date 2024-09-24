const introduction = (reclamante, numeroDoProcesso, reclamada) => `Bom dia, ${reclamante}. No processo trabalhista ${numeroDoProcesso} contra a empresa ${reclamada}, você consta como parte. Confirma essa informação? \n Digite: "Confirmo" para prosseguir \n Digite: "Não" para cancelar`
const confirmation = "Confirmo."
const notFound = "Não sou essa pessoa."
const confirmationText = "Obrigado pela confirmação!"
const badEnding = "Pedimos desculpas e agradecemos."
const confirmation2 = "Isso me interessa."
const confirmation3 = "Ainda tenho dúvidas."
const question = `Tendo em vista que essa etapa pode se estender, saiba que você tem o direito de receber parte desse valor de forma antecipada por meio do crédito consignado em ações trabalhistas.\n Digite: "Isso me interessa" para confirmar \n Digite: "Ainda tenho dúvida", caso ainda esteja indeciso.`
const goodEnding = "Nosso consultor entrará em contato o mais brevemente possível. Obrigado."

module.exports = { introduction, confirmation, notFound, confirmationText, badEnding, confirmation2, confirmation3, question, goodEnding }