export function formatMessages(messages) {

    return messages.map((message) => {
        role: message.role === "user" ? "user" : "model";
        parts: [
            { 
                text: message.text,
            }
        ]
    });
    
}