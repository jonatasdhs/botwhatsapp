export const interactiveButton = (text, phone, array) => {
    return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "interactive",
        interactive: {
            type: "button",
            body: {
                text: `${text}`
            },
            action: {
                buttons: array.map((item, index) => {
                    return {
                        type: "reply",
                        reply: {
                            id: index,
                            title: item
                        }
                    }
                })
            }
        }
    }
}

export const textMessage = (destination, message) => {
    return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: destination,
        type: "text",
        text: {
            body: message
        }
    }
}
