import axios from "axios";

export async function sendMessage(data) {
    await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${process.env.WAID}/messages`,
        headers: {
            Authorization: `Bearer ${process.env.WEBHOOK_VERIFY_TOKEN}`,
        },
        data,
    })
}

export async function markAsRead(id) {
    await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${process.env.WAID}/messages`,
        headers: {
            Authorization: `Bearer ${process.env.WEBHOOK_VERIFY_TOKEN}`,
        },
        data: {
            messaging_product: "whatsapp",
            status: "read",
            message_id: id,
        },
    });
}