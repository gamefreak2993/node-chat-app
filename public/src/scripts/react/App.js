import React, { Component } from "react";
import { Route, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Login from "./components/Login";
import Chat from "./components/Chat";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser, faPersonBooth } from "@fortawesome/free-solid-svg-icons";

library.add(faUser, faPersonBooth);

class App extends Component {
    render() {
        return (
            <TransitionGroup appear={true}>
                <CSSTransition
                    timeout={250}
                    classNames="fade"
                >
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route path="/chat" component={Chat}/>
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        );
    };
};

export default App;