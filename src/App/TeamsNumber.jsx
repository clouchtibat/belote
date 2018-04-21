import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';

import Centerer from './Centerer';

export default class TeamsNumber extends Component {
    constructor() {
        super();

        this.state = {};
    }

    @autobind
    setTeams(e) {
        this.setState({
            ...this.state,
            teamsNumber: parseInt(e.target.value, 10),
        });
    }

    @autobind
    formSubmit(e) {
        e.preventDefault();
        this.props.onSetTeamsNumber(this.state.teamsNumber);
    }

    render() {
        const { formSubmit, setTeams } = this;
        const { teamsNumber } = this.state;
        const title = "Choisissez le nombre d'équipes";

        return (
            <Centerer className="teams-number">
                <h1>{title}</h1>
                <form onSubmit={formSubmit}>
                    <input
                        type="number"
                        name="teams"
                        min="0"
                        max="100"
                        value={teamsNumber}
                        onChange={setTeams}
                    />
                    <input type="submit" className="button" />
                </form>
            </Centerer>
        );
    }
}

TeamsNumber.propTypes = {
    onSetTeamsNumber: PropTypes.func.isRequired,
};

