import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import mockState from './mockState';

import './app.scss';

export function getWonSets(team) {
    return team.sets.reduce((a, c) => (c === 'w' ? a + 1 : a), 0);
}

export function getTotal(team) {
    return team.tableTurn + (getWonSets(team) * 1000);
}

export default class AppComponent extends Component {
    constructor() {
        super();
        this.state = mockState;
    }


    @autobind
    setTeams(e) {
        this.setState({
            ...this.state,
            teamsNumber: parseInt(e.target.value, 10),
        });
    }

    @autobind
    toggleStay(index) {
        const teams = this.state.teams.slice();
        teams[index] = {
            ...teams[index],
            isStaying: !teams[index].isStaying,
        };

        this.setState({
            ...this.state,
            teams,
        });
    }


    @autobind
    chooseTeams(e) {
        console.log('choose teams');
        e.preventDefault();

        const teams = [];
        for (let i = 0; i < this.state.teamsNumber; i++) {
            teams.push({ id: `t${i}`, name: i + 1, tableTurn: 0, sets: new Array(4).fill('x') });
        }

        this.setState({
            ...this.state,
            teams,
        });
    }

    @autobind
    createArray() {
        console.log('create array');

        console.log(this.state);
        console.log(JSON.stringify(this.state, 0, 4));

        this.setState({
            ...this.state,
            table: new Array(this.state.teamsNumber).fill({
                test: 'test',
            }),
        });
    }

    @autobind
    setTableTurn({ target: { dataset: { id }, value } }) {
        console.log('set table turn');
        console.log(id);
        console.log(value);

        this.setState({
            ...this.state,
            teams: this.state.teams.map(team => (team.id === id ? {
                ...team,
                tableTurn: parseInt(value, 10) || 0,
            } : team)),
        });
    }

    @autobind
    setWon({ target: { dataset: { id, set } } }) {
        console.log('set won');
        console.log(id);
        console.log(set);

        this.setSet(id, set, 'w');
    }

    @autobind
    setLose({ target: { dataset: { id, set } } }) {
        console.log('set lose');
        console.log(id);
        console.log(set);

        this.setSet(id, set, 'l');
    }

    @autobind
    setSet(id, set, value) {
        console.log('set won');
        console.log(id);
        console.log(set);

        this.setState({
            ...this.state,
            teams: this.state.teams.map(team => (team.id === id ? {
                ...team,
                sets: team.sets.map((s, index) => (`${index}` === set ? value : s)),
            } : team)),
        });
    }

    render() {
        const { chooseTeams, setTeams, toggleStay, createArray, setTableTurn, setWon, setLose } = this;
        const { teams, table } = this.state;

        console.log('render');
        console.log(teams);

        return (
            <div className="app">
                {!teams && (
                    <form onSubmit={chooseTeams}>
                        <input type="text" name="teams" onChange={setTeams} />
                        <input type="submit" />
                    </form>
                )}
                {teams && (
                    <div>
                        {teams.map((team, index) => (
                            <button className={classNames({ 'is-staying': team.isStaying })} key={`t${index}`} onClick={() => { toggleStay(index); }}>{index + 1}</button>
                        ))}
                        <button onClick={createArray}>Générer tableau</button>
                    </div>
                )}
                {table && (
                    <table>
                        <thead>
                            <tr><th>Equipe</th><th>Tour de table</th>
                                <th>Partie 1</th>
                                <th>Partie 2</th>
                                <th>Partie 3</th>
                                <th>Partie 4</th>
                                <th>Total points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map(team => (
                                <tr key={team.id}>
                                    <td>{team.name}</td>
                                    <td><input type="text" data-id={team.id} value={team.tableTurn} onChange={setTableTurn} /></td>
                                    {team.sets.map((set, index) => {
                                        const key = `${team.id}_${index}`;
                                        return (
                                            <td key={key}>
                                                <input type="radio" data-id={team.id} data-set={index} name={key} onChange={setWon} />
                                                <input type="radio" data-id={team.id} data-set={index} name={key} onChange={setLose} />
                                            </td>
                                        );
                                    })}
                                    <td>{getWonSets(team)}</td>
                                    <td>{getTotal(team)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                )}
            </div>

        );
    }
}

