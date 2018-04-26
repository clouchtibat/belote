import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';

import Centerer from './Centerer';

export function createTables(teams) {
    const tables = [];
    const length = Math.floor(teams.length / 2);
    const teamPicker = teams.slice();
    for (let i = 0; i < length; i++) {
        const [team1] = teamPicker.splice(Math.floor(Math.random() * teamPicker.length), 1);
        const [team2] = teamPicker.splice(Math.floor(Math.random() * teamPicker.length), 1);
        tables.push({ id: `table${i}`, name: `Table ${i + 1}`, rounds: [[team1, team2]] });
    }

    return { tables, remainingTeam: teamPicker[0] };
}

export default class TableSorter extends Component {
    constructor() {
        super();

        this.state = {};
    }

    componentWillMount() {
        this.redoTables();
    }

    componentWillReceiveProps(nextProps) {
        const { teams } = nextProps;
        const { tables, remainingTeam } = createTables(teams);
        this.setState({
            ...this.state,
            tables,
            remainingTeam,
        });
    }


    @autobind
    setTables() {
        const { onSetTables } = this.props;
        const { tables, remainingTeam, remaining } = this.state;
        const remains = remainingTeam ? [remainingTeam, ...remaining] : undefined;
        onSetTables(tables, remains);
    }

    @autobind
    reverse({ target: { dataset: { id } } }) {
        this.setState({
            ...this.state,
            tables: this.state.tables.map(table => (table.id === id ? {
                ...table,
                rounds: [table.rounds[0].slice().reverse()],
            } : table)),
        });
    }

    @autobind
    generateRounds() {
        const { tables, remainingTeam } = this.state;
        const stay = tables.map(table => table.rounds[0][0]);
        let move = tables.map(table => table.rounds[0][1]);
        if (remainingTeam) {
            move.push(remainingTeam);
        }
        let tmp = tables;
        const map = (item, index) => [item, move[index]];
        const remaining = [];
        for (let i = 1; i < 4; i++) {
            move = [move[move.length - 1], ...move.slice(0, move.length - 1)];
            remaining.push(move[move.length - 1]);
            const rounds = stay.map(map);
            tmp = tmp.map((table, tableIndex) => ({
                ...table,
                rounds: [...table.rounds, rounds[tableIndex]],
            }));
        }

        this.setState({
            ...this.state,
            tables: tmp,
            remaining,
        });
    }

    @autobind
    redoTables() {
        const { teams } = this.props;
        const { tables, remainingTeam } = createTables(teams);
        this.setState({
            ...this.state,
            tables,
            remainingTeam,
        });
    }

    render() {
        const { reverse, generateRounds, redoTables, setTables } = this;
        const { tables, remainingTeam, remaining } = this.state;
        const title = 'Tirage au sort';

        return (
            <Centerer className="table-sorter">
                <h1>{title}</h1>
                <div className="actions">
                    <button className="button" onClick={redoTables}>Refaire le tirage</button>
                    <button className="button" onClick={generateRounds}>Créer les parties</button>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Table</th>
                            <th>Partie 1</th>
                            <th>Partie 2</th>
                            <th>Partie 3</th>
                            <th>Partie 4</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.map(table => (
                            <tr key={table.id}>
                                <td>{table.name}</td>
                                {table.rounds.map((round, index) => (
                                    <td>
                                        {`${round[0].name} / ${round[1].name}`}
                                        {!index && (
                                            <i
                                                className="button reverse ti-control-shuffle"
                                                data-id={table.id}
                                                onClick={reverse}
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {!!remainingTeam && (
                            <tr className="hat">
                                <td className="hat-title">Chapeau</td>
                                <td>{remainingTeam.name}</td>
                                {!!remaining && remaining.map(remain => (
                                    <td>{remain.name}</td>
                                ))}
                            </tr>
                        )}
                    </tbody>
                </table>

                <button className="button end" onClick={setTables}>Terminer</button>
            </Centerer>
        );
    }
}

TableSorter.propTypes = {
    teams: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onSetTables: PropTypes.func.isRequired,
};

