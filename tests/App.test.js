import React from "react";
import { shallow } from "enzyme";
import App from "./../public/src/scripts/react/App";

describe("<App/>", () => {
    it("should have an initial state with one message", () => {
        const wrapper = shallow(<App/>);

        const message = {
            from: "Admin",
            text: "Chat room initiated."
        }

        expect(wrapper.state().messages).toHaveLength(1);
        expect(wrapper.state().messages[0]).toMatchObject(message);
    });

    it("should render the chat panel correctly", () => {
        const wrapper = shallow(<App/>),
            chat = wrapper.find("#chat"),
                chatPanel = chat.find("#chat-panel"),
                    chatMessages = chatPanel.find(".chat-message"),
                chatForm = chat.find("#chat-form"),
                    chatWhat = chatForm.find("#chat-what"),
                    chatSubmit = chatForm.find("#chat-submit");

        expect(chat).toBeTruthy();
        expect(chatPanel).toBeTruthy();
        expect(chatMessages).toBeTruthy();
        expect(chatMessages).toHaveLength(1);
        expect(chatForm).toBeTruthy();
        expect(chatWhat).toBeTruthy();
        expect(chatSubmit).toBeTruthy();
    });

    it("should add a new message when submitting the form", () => {
        const wrapper = shallow(<App/>),
            chatForm = wrapper.find("#chat-form"),
            chatMessage = wrapper.find(".chat-message").last().find(".chat-text").text();

        const seedMessage = "Hey, what's up?";

        chatForm.simulate("submit", {
            preventDefault: jest.fn(),
            target: {
                id: "chat-form",
                elements: {
                    "chat-what": {
                        value: seedMessage,
                        classList: {
                            remove: jest.fn()
                        }
                    }
                }
            }
        });

        setTimeout(() => {
            expect(chatMessage).toBe(seedMessage);
        }, 0); // It needs to wait for socket.io
    });
});