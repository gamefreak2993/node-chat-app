import React, { Component } from "react";
import moment from "moment";

class Message extends Component {
    render() {
        const {
            instance,
            from,
            text,
            createdAt
        } = this.props;

        const time = moment(createdAt).format("h:mm a");

        return (
            <div className={`chat-message${from === "Admin" ? " admin" : ""}${instance.name === from ? " me" : ""}`}>
                <div className="chat-content">
                    <span className="chat-from">{from}</span><span className="chat-text">{text}</span>
                </div>
                <div className="chat-details">{from !== "Admin" && time}</div>
            </div>
        );
    };
};

export default Message;