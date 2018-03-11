import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

import './app.scss';

export default class AppComponent extends Component {

    constructor(){
        super();
        this.state = {};
    }

    @autobind
    toggleStay(index){
        const teams = this.state.teams.slice();
        teams[index] = {
            ...teams[index],
            isStaying: !teams[index].isStaying,
        }

        this.setState({
            ...this.state,
            teams,
        })
    }

    @autobind
    setTeams(e){
        this.setState({
            ...this.state,
            teamsNumber: parseInt(e.target.value),
        })
    }

    @autobind
    chooseTeams(e) {
        console.log("choose teams")
        e.preventDefault();
        this.setState({
            ...this.state,
            teams: new Array(this.state.teamsNumber).fill({
                test: "test"
            }),
        })
    }

    @autobind
    createArray() {
        console.log("create array")
    }

    render() {

        const { chooseTeams, setTeams, toggleStay, createArray } = this;
        const { teams } = this.state;

        return (
            <div className="app">
            {!teams && (
                <form onSubmit={chooseTeams}>
                <input type="text" name="teams" onChange={setTeams} />
                <input type="submit"/>
            </form>
            )}
            {teams && (
                <div>
                    {teams.map((team, index) => (
                        <button className={classNames({'is-staying': team.isStaying})} key={'t'+index} onClick={() => {toggleStay(index)}}>{index + 1}</button>
                    ))}
                    <button onClick={createArray}>Générer tableau</button>
                </div>
            )}
            </div>

        );
    }
}

