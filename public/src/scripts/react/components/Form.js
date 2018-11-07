import React, { Component } from "react";

class Form extends Component {
    render() {
        const {
            onHandleSubmit
        } = this.props;

        return (
            <form
                id="chat-form"
                onSubmit={onHandleSubmit}
                autoComplete="off"
            >
                <input
                    type="text"
                    id="chat-what"
                    placeholder="What's on your mind?"
                    autoFocus={true}
                />

                <input
                    type="submit"
                    id="chat-submit"
                    value="Send"
                />
            </form>
        );
    };
};

export default Form;