import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import TeamsNumber from './TeamsNumber';
import Centerer from './Centerer';

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

        const tmp = localStorage.getItem('state');
        console.log('component constructor');
        console.log(tmp);

        this.state = JSON.parse(tmp);

        this.originalSetState = this.setState;

        this.setState = (state) => {
            console.log('set state');
            console.log(state);
            this.originalSetState(state);
            localStorage.setItem('state', JSON.stringify(state));
        };
    }

    @autobind
    setTeamsNumber(teamsNumber) {
        const teams = [];
        for (let i = 0; i < teamsNumber; i++) {
            teams.push({ id: `t${i}`, name: i + 1, tableTurn: 0, sets: new Array(4).fill('x') });
        }

        this.setState({
            ...this.state,
            teams,
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
    toggleSort() {
        this.setState({
            ...this.state,
            sortedByScore: !this.state.sortedByScore,
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
    reset() {
        if (confirm('Réinitialiser partie?')) { //eslint-disable-line
            this.setState({
                teams: undefined,
                table: undefined,
            });
        }
    }

    render() {
        const { setTeamsNumber, toggleStay, createArray,
            setTableTurn, setWon, setLose, toggleSort, reset } = this;
        const { teams, table, sortedByScore } = this.state;

        console.log('render');
        console.log(teams);

        const sortedTeams = (teams || []).slice();
        if (sortedByScore) {
            sortedTeams.sort((a, b) => getTotal(a) - getTotal(b));
            sortedTeams.reverse();
        }

        /*
                                                    <span>

                                                        <input
                                                            type="radio"
                                                            data-id={team.id}
                                                            data-set={index}
                                                            name={key}
                                                            onChange={setWon}
                                                            checked={isWon}
                                                        />Gagné
                                                    </span>
                                                    <span>
                                                        <input
                                                            type="radio"
                                                            data-id={team.id}
                                                            data-set={index}
                                                            name={key}
                                                            onChange={setLose}
                                                            checked={isLost}
                                                        />Perdu
                                                    </span>

        */


        return (
            <div className="app">
                <button className="button reset" onClick={reset}>Réinitialiser</button>
                {!teams && (
                    <TeamsNumber onSetTeamsNumber={setTeamsNumber} />
                )}
                {(teams && !table) && (
                    <Centerer className="teams-settings">
                        <h1>Choisir les équipes qui ne vont pas changer de table:</h1>
                        <div className="teams">
                            {teams.map((team, index) => (
                                <button
                                    className={classNames('button', { selected: team.isStaying })}
                                    key={team.id}
                                    onClick={() => { toggleStay(index); }}
                                >{index + 1}
                                </button>
                            ))}
                        </div>
                        <button className="button generate" onClick={createArray}>Générer tableau</button>
                    </Centerer>
                )}
                {table && (
                    <div className="score-table">
                        <button
                            className={classNames('button sort-rank', { selected: sortedByScore })}
                            onClick={toggleSort}
                        >Trier par score
                        </button>
                        <table className="table">
                            <thead>
                                <tr><th>Equipe</th><th>Tour de table</th>
                                    <th>Partie 1</th>
                                    <th>Partie 2</th>
                                    <th>Partie 3</th>
                                    <th>Partie 4</th>
                                    <th>Parties gagnées</th>
                                    <th>Total points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTeams.map(team => (
                                    <tr key={team.id}>
                                        <td>{team.name}</td>
                                        <td className="table-turn"><input type="text" data-id={team.id} value={team.tableTurn} onChange={setTableTurn} /></td>
                                        {team.sets.map((set, index) => {
                                            const key = `${team.id}_${index}`;
                                            const isWon = set === 'w';
                                            const isLost = set === 'l';
                                            return (
                                                <td key={key} className={classNames('set', { won: isWon, lost: isLost })}>
                                                    <button
                                                        className="button status"
                                                        data-id={team.id}
                                                        data-set={index}
                                                        onClick={setWon}
                                                    >Gagné
                                                    </button>
                                                    <button
                                                        className="button status"
                                                        data-id={team.id}
                                                        data-set={index}
                                                        onClick={setLose}
                                                    >Perdu
                                                    </button>
                                                </td>
                                            );
                                        })}
                                        <td>{getWonSets(team)}</td>
                                        <td>{getTotal(team)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                )}
            </div>

        );
    }
}

