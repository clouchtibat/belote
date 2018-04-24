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

    console.log('team remaining');
    console.log(teamPicker);

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
        this.setState({
            ...this.state,
            tables: createTables(teams),
        });
    }


    @autobind
    setTables() {
        console.log('set tables');
        const { onSetTables } = this.props;
        onSetTables(this.state.tables);
    }

    @autobind
    reverse({ target: { dataset: { id } } }) {
        console.log(this);
        console.log('todo reverse table');
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
        console.log('generate rounds');
        const { tables, remainingTeam } = this.state;
        const { teams } = this.props;
        const stay = tables.map(table => table.rounds[0][0]);
        let move = tables.map(table => table.rounds[0][1]);
        console.log(teams.length % tables.length);
        if (remainingTeam) {
            move.push(remainingTeam);
        }
        console.log(stay);
        console.log(move);
        let tmp = tables;
        const map = (item, index) => [item, move[index]];
        for (let i = 1; i < 4; i++) {
            move = [move[move.length - 1], ...move.slice(0, move.length - 1)];
            const rounds = stay.map(map);
            console.log('rounds');
            console.log(rounds);
            tmp = tmp.map((table, tableIndex) => ({
                ...table,
                rounds: [...table.rounds, rounds[tableIndex]],
            }));

            console.log('move');
            console.log(move);
        }
        console.log(tmp);
        this.setState({
            ...this.state,
            tables: tmp,
        });
    }

    @autobind
    redoTables() {
        console.log('rddo tables');
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
        const { tables } = this.state;
        const title = 'Tirage au sort';


        console.log('tables');
        console.log(tables);

        return (
            <Centerer className="table-sorter">
                <h1>{title} <button className="button" onClick={redoTables}>Refaire le tirage</button></h1>
                <table className="table">
                    <thead>
                        <tr>
                            <td>Table</td>
                            <td>Partie 1</td>
                            <td>Partie 2</td>
                            <td>Partie 3</td>
                            <td>Partie 4</td>
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
                    </tbody>
                </table>
                <button className="button" onClick={generateRounds}>Créer les parties</button>
                <button className="button" onClick={setTables}>Terminer</button>
            </Centerer>
        );
    }
}

TableSorter.propTypes = {
    teams: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onSetTables: PropTypes.func.isRequired,
};

