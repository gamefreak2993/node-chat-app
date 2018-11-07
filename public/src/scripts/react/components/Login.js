import React, { Component } from "react";
import io from "socket.io-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const socket = io();

class Login extends Component {
    state = {
        LoginError: ""
    };

    handleChange = (event) => {
        if (event.target.value !== "" && event.target.value.length > 0) {
            event.target.classList.add("touched");
        } else {
            event.target.classList.remove("touched");
        }
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const nameElement = event.target.elements["login-name"],
            name = nameElement.value,
            roomElement = event.target.elements["login-room"],
            room = roomElement.value.toLowerCase();

        const instance = {name, room}

        socket.emit("login", instance, (err, targets) => {
            if (err) {
                targets.forEach((target) => {
                    if (target === "name") {
                        nameElement.classList.add("bad");
                    } else {
                        nameElement.classList.remove("bad");
                    };

                    if (target === "room") {
                        roomElement.classList.add("bad");
                    } else {
                        roomElement.classList.remove("bad");
                    };
                });

                this.setState({
                    LoginError: err
                });
            } else {
                window.location.href = `/chat?name=${encodeURIComponent(name)}&room=${encodeURIComponent(room)}`;

                this.setState({
                    LoginError: ""
                });
            };
        });
    };

    render() {
        const {
            LoginError
        } = this.state;

        return (
            <div id="login" className="panel">
                <div id="login-panel">
                    <form
                        id="login-form"
                        action="/chat"
                        onSubmit={this.handleSubmit}
                    >
                        <div className="input-group">
                            <input
                                type="text"
                                id="login-name"
                                name="name"
                                onChange={this.handleChange}
                                autoFocus={true}
                            />

                            <label htmlFor="login-name">
                                <FontAwesomeIcon icon="user"/>Display name
                            </label>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                id="login-room"
                                name="room"
                                onChange={this.handleChange}
                            />

                            <label htmlFor="login-room">
                                <FontAwesomeIcon icon="person-booth"/>Room name
                            </label>
                        </div>
                        

                        <input
                            type="submit"
                            value="Join &rarr;"
                            id="login-submit"
                        />
                    </form>
                </div>

                <p id="error">{LoginError}</p>
            </div>
        );
    };
};

export default Login;