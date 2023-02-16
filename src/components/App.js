import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { Layout } from './Layout';
import Home from '../pages/Home';
import Dictionary from '../pages/Dictionary';
import FlashCards from '../pages/FlashCards';
import Pronunciation from '../pages/Pronunciation';

export default class App extends Component {
    render() {
        return (
            <Switch>
                <Layout>    
                    <Route exact path="/" component={Home} />             
                    <Route exact path="/dictionary" component={Dictionary} />
                    <Route exact path="/flashcards" component={FlashCards} />
                    <Route exact path="/pronunciation" component={Pronunciation} />
                </Layout>
            </Switch>
        );
    }
}
