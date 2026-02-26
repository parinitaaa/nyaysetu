export const getMockAIResponse = (message: string): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const lower = message.toLowerCase();
            if (lower.includes('risk')) {
                resolve("Legal risks associated with your document include potential penalties for late payments and specific liability clauses in Section 8.");
            } else if (lower.includes('rights')) {
                resolve("Under Indian law, you have the right to peaceful possession of the property and a fair notice period before any eviction attempt.");
            } else {
                resolve("I've analyzed your query. Based on the document provided, the terms are fairly standard for a residential agreement in India. Would you like me to clarify any specific section?");
            }
        }, 1500);
    });
};
