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

        console.log('teams');
        console.log(team1);
        console.log(team2);
        console.log(teamPicker);

        tables.push({ id: `t${i}`, name: i + 1, rounds: [[team1, team2]] });
    }

    return tables;
}

export default class TableSorter extends Component {
    constructor() {
        super();

        this.state = {};
    }

    componentWillMount() {
        const { teams } = this.props;
        this.setState({
            ...this.state,
            tables: createTables(teams),
        });
    }

    componentWillReceiveProps(nextProps) {
        const { teams } = nextProps;
        this.setState({
            ...this.state,
            tables: createTables(teams),
        });
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

    render() {
        const { teams } = this.props;
        const { reverse } = this;
        const { tables } = this.state;
        const title = 'Tirage au sort';


        console.log('tables');
        console.log(tables);

        return (
            <Centerer className="table-sorter">
                <h1>{title}</h1>
                <table className="table">
                    <tbody>
                        {tables.map(table => (
                            <tr key={table.id}>
                                <td>{table.name}</td>
                                <td>
                                    {`${table.rounds[0][0].id} / ${table.rounds[0][1].id}`}
                                    <button data-id={table.id} onClick={reverse}>reverse</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Centerer>
        );
    }
}

TableSorter.propTypes = {
    onSetTeamsNumber: PropTypes.func.isRequired,
};

