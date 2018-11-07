import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import moment from "moment";
import io from "socket.io-client";
import $ from "jquery";

import Message from "./Message";
import Form from "./Form";
import Users from "./Users";

import { setInstance } from "./../utils/setInstance";

const socket = io();

class Chat extends Component {
    state = {
        instance: {
            name: "",
            room: ""
        },
        users: [],
        messages: [
            {
                from: "Admin",
                text: "Chat room initiated.",
                createdAt: moment().valueOf()
            }
        ]
    };

    componentDidMount() {
        setInstance(this);

        socket.on("connect", () => {
            socket.emit("joined", this.state.instance, (err) => {
                if (err) {
                    alert(err);
                    window.location.href = "/";
                };
            });

            this.handleScroll();
        });

        socket.on("updateUserList", (users) => {
            this.setState({users});
        });

        socket.on("newMessage", (message) => {
            this.setState((prevState) => ({
                messages: [
                    ...prevState.messages,
                    message
                ]
            }));

            this.handleScroll();
        });

        socket.on("welcomeMessage", (message) => {
            this.setState((prevState) => ({
                messages: [
                    ...prevState.messages,
                    message
                ]
            }));

            this.handleScroll();
        });

        socket.on("newUserMessage", (message) => {
            this.setState((prevState) => ({
                messages: [
                    ...prevState.messages,
                    message
                ]
            }));

            this.handleScroll();
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const form = document.querySelector(`#${event.target.id}`),
            from = this.state.instance.name,
            textElement = event.target.elements["chat-what"],
            text = textElement.value,
            message = {from, text};

        socket.emit("createMessage", message, (err) => {
            if (err) {
                textElement.classList.add("bad");
            } else {
                textElement.classList.remove("bad");
                form.reset();
            };
        });
    };

    handleScroll = () => {
        const $chatPanel = $("#chat-panel"),
            $chatNotification = $chatPanel.find("#chat-notification"),
            $chatContainer = $chatPanel.find(".chat-container"),
            $latestMessage = $chatContainer.children(".chat-message:last"),
            $lastMessage = $latestMessage.prev(),
            clientHeight = $chatPanel.prop("clientHeight"),
            scrollTop = $chatPanel.prop("scrollTop"),
            scrollHeight = $chatPanel.prop("scrollHeight");

        if (
            clientHeight +
            scrollTop +
            $latestMessage.innerHeight() +
            $lastMessage.innerHeight() >=
            scrollHeight
        ) {
            $chatNotification.removeClass("active");
            $chatPanel.scrollTop(scrollHeight);
        } else {
            $chatNotification.addClass("active");
        };

        $chatPanel.on("scroll", () => {
            $chatNotification.removeClass("active");
        });
    };

    handleClick = (event) => {
        document.querySelector("#chat-panel").scrollTop = document.querySelector("#chat-panel").scrollHeight;
        document.querySelector(`#${event.target.id}`).classList.remove("active");
    };

    render() {
        const {
            instance,
            users,
            messages
        } = this.state;

        return (
            <div id="chat" className="panel">
                <Users users={users} instance={instance}/>

                <div id="chat-panel">
                    <TransitionGroup appear={true} className="chat-container">
                        {messages.map((message, index) => (
                            <CSSTransition
                                key={index}
                                timeout={250}
                                classNames="fade"
                            >
                                <Message
                                    key={index}
                                    instance={instance}
                                    from={message.from}
                                    text={message.text}
                                    createdAt={message.createdAt}
                                />
                            </CSSTransition>
                        ))}
                    </TransitionGroup>

                    <div
                        id="chat-notification"
                        onClick={this.handleClick}
                    >
                        more messages below
                    </div>
                </div>

                <Form
                    onHandleSubmit={this.handleSubmit}
                />
            </div>
        );
    };
};

export default Chat;