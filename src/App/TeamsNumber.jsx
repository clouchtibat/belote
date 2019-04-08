import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Centerer from './Centerer';

export default class TeamsNumber extends Component {
	constructor() {
		super();

		this.state = {};
	}

	setTeams = e => {
		this.setState({
			...this.state,
			teamsNumber: parseInt(e.target.value, 10)
		});
	};

	setSets = e => {
		this.setState({
			...this.state,
			setsNumber: parseInt(e.target.value, 10)
		});
	};

	formSubmit = e => {
		e.preventDefault();
		this.props.onSetTeamsNumber(this.state.teamsNumber, this.state.setsNumber);
	};

	render() {
		const { formSubmit, setTeams, setSets } = this;
		const { teamsNumber, setsNumber } = this.state;

		return (
			<Centerer className="teams-number">
				<form onSubmit={formSubmit}>
					<div className="line">
						<label htmlFor="teams">Nombre d&#39;équipes:</label>
						<input type="number" name="teams" min="2" max="500" value={teamsNumber} onChange={setTeams} />
					</div>
					<div className="line">
						<label htmlFor="teams">Nombre de parties:</label>
						<input type="number" name="sets" min="1" max="100" value={setsNumber} onChange={setSets} />
					</div>
					<input type="submit" className="button" />
				</form>
			</Centerer>
		);
	}
}

TeamsNumber.propTypes = {
	onSetTeamsNumber: PropTypes.func.isRequired
};
