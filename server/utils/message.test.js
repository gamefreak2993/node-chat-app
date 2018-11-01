const { generateMessage } = require("./messages");

describe("generateMessage", () => {
    test("should generate a message object with a \"createdAt\" property", () => {
        const from = "Admin",
            text = "Testing message.",
            message = generateMessage(from, text);

        expect(message).toMatchObject({from, text});
        expect(message.createdAt).toBeTruthy();
        expect(typeof message.createdAt).toBe("number");
    });
});