import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import TeamsNumber from './TeamsNumber';
import TableSorter from './TableSorter';
import Centerer from './Centerer';

import './app.scss';

/* global sessionStorage */

export function getWonSets(team) {
    return team.sets.reduce((a, c) => (c === 'w' ? a + 1 : a), 0);
}

export function getTotal(team, type) {
    return team.tableTurn + (getWonSets(team) * (type === 'belotte' ? 1000 : 100));
}

export default class AppComponent extends Component {
    constructor() {
        super();

        const tmp = sessionStorage.getItem('state');
        console.log('component constructor');
        console.log(tmp);

        this.state = JSON.parse(tmp) || {};

        this.originalSetState = this.setState;

        this.setState = (state) => {
            console.log('set state');
            console.log(state);
            this.originalSetState(state);
            sessionStorage.setItem('state', JSON.stringify(state));
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
    setType({ target: { dataset: { type } } }) {
        console.log('set type');
        console.log(type);
        this.setState({
            ...this.state,
            type,
        });
    }

    @autobind
    setTables(tables) {
        console.log('set tables');
        console.log(tables);
        this.setState({
            ...this.state,
            tables,
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
    reset() {
        if (confirm('Réinitialiser partie?')) { //eslint-disable-line
            this.setState({
                type: undefined,
                teamsNumber: undefined,
                teams: undefined,
                tables: undefined,
            });
        }
    }

    render() {
        const { setTeamsNumber,
            setTableTurn, setWon, setLose, toggleSort, reset, setType, setTables } = this;
        const { teams, tables, sortedByScore, type } = this.state;

        console.log('render');
        console.log(teams);

        const sortedTeams = (teams || []).slice();
        if (sortedByScore) {
            sortedTeams.sort((a, b) => getTotal(a, type) - getTotal(b, type));
            sortedTeams.reverse();
        }

        return (
            <div className="app">
                <button className="button reset" onClick={reset}>Réinitialiser</button>
                {!type && (
                    <Centerer className="choose-type">
                        <button className="button" data-type="belotte" onClick={setType}>Belotte</button>
                        <button className="button" data-type="manille" onClick={setType}>Manille</button>
                    </Centerer>
                )}
                {type && (
                    <div>
                        <h1 className="title">{type}</h1>
                        {!teams && (
                            <TeamsNumber onSetTeamsNumber={setTeamsNumber} />
                        )}
                        {(teams && !tables) && (
                            <TableSorter teams={teams} onSetTables={setTables} />
                        )}
                        {tables && (
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
                                                <td>{getTotal(team, type)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        )}
                    </div>
                )}

            </div>

        );
    }
}

