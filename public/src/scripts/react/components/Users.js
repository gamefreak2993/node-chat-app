import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Users extends Component {
    render() {
        const {
            users,
            instance
        } = this.props;

        return (
            <TransitionGroup id="users-panel">
                    {users.map((user, index) => (
                        <CSSTransition
                            key={index}
                            timeout={250}
                            classNames="fadeUser"
                        >
                            <div className="user" key={index}><FontAwesomeIcon icon="user"/>{user.name === instance.name ? `${user.name} (you)` : user.name}</div>
                        </CSSTransition>
                    ))}
            </TransitionGroup>
        );
    };
};

export default Users;