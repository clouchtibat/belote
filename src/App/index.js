import React, { Component } from 'react';
import classNames from 'classnames';
import TeamsNumber from './TeamsNumber';
import TableSorter from './TableSorter';
import Centerer from './Centerer';
import Tabs from './Tabs';
import partiesHeaders from './PartiesHeader';
import { version } from 'config';

import './app.scss';

/* global sessionStorage */

export function getWonSets(team) {
	return team.sets.reduce((a, c) => (c === 'w' ? a + 1 : a), 0);
}

export function getTotal(team, type) {
	return team.tableTurn + getWonSets(team) * (type === 'belote' ? 1000 : 100);
}

export function setTitle(title) {
	document.title = title.charAt(0).toUpperCase() + title.slice(1);
}

export default class AppComponent extends Component {
	constructor() {
		super();

		const tmp = sessionStorage.getItem('state');

		this.state = JSON.parse(tmp) || {};
		setTitle(this.state.type || 'Belote');

		this.originalSetState = this.setState;

		this.setState = state => {
			this.originalSetState(state);
			sessionStorage.setItem('state', JSON.stringify(state));
			console.log('set state');
			console.log(state.type);
			if (state.type) {
				const save = JSON.parse(localStorage.getItem('save')) || {};
				save[state.type] = state;
				localStorage.setItem('save', JSON.stringify(save));
			}
		};
	}

	setTeamsNumber = (teamsNumber, setsNumber) => {
		const teams = [];
		for (let i = 0; i < teamsNumber; i++) {
			teams.push({ id: `t${i}`, name: i + 1, tableTurn: 0, sets: new Array(setsNumber).fill('x') });
		}

		this.setState({
			...this.state,
			teams,
			setsNumber
		});
	};

	setTableTurn = ({ target: { dataset: { id }, value } }) => {
		this.setState({
			...this.state,
			teams: this.state.teams.map(
				team =>
					team.id === id
						? {
								...team,
								tableTurn: parseInt(value, 10) || 0
							}
						: team
			)
		});
	};

	setWon = ({ target: { dataset: { id, set } } }) => {
		this.setSet(id, set, 'w');
	};

	setLose = ({ target: { dataset: { id, set } } }) => {
		this.setSet(id, set, 'l');
	};

	setSet = (id, set, value) => {
		this.setState({
			...this.state,
			teams: this.state.teams.map(
				team =>
					team.id === id
						? {
								...team,
								sets: team.sets.map((s, index) => (`${index}` === set ? value : s))
							}
						: team
			)
		});
	};

	setType = ({ target: { dataset: { type } } }) => {
		this.setState({
			...this.state,
			type
		});
		setTitle(type);
	};

	setTables = (tables, remaining) => {
		this.setState({
			...this.state,
			tables,
			remaining
		});
	};

	toggleStay = index => {
		const teams = this.state.teams.slice();
		teams[index] = {
			...teams[index],
			isStaying: !teams[index].isStaying
		};

		this.setState({
			...this.state,
			teams
		});
	};

	toggleSort = () => {
		this.setState({
			...this.state,
			sortedByScore: !this.state.sortedByScore
		});
	};

	reset = () => {
		if (window.confirm('Réinitialiser partie?')) {
			//eslint-disable-line
			this.setState({
				type: undefined,
				teamsNumber: undefined,
				teams: undefined,
				tables: undefined
			});
		}
	};

	render() {
		const { setTeamsNumber, setTableTurn, setWon, setLose, toggleSort, reset, setType, setTables } = this;
		const { teams, tables, sortedByScore, type, remaining, setsNumber } = this.state;
		let displayedTeams = (teams || []).slice();

		const sortedTeams = displayedTeams.slice();
		sortedTeams.sort((a, b) => getTotal(a, type) - getTotal(b, type));
		sortedTeams.reverse();

		if (sortedByScore) {
			displayedTeams = sortedTeams;
		}

		return (
			<div className="app">
				<div className="version">{version}</div>
				<button className="button reset" onClick={reset}>
					Réinitialiser
				</button>
				{!type && (
					<Centerer className="choose-type">
						<button className="button" data-type="belote" onClick={setType}>
							Belote
						</button>
						<button className="button" data-type="manille" onClick={setType}>
							Manille
						</button>
					</Centerer>
				)}
				{type && (
					<div>
						<h1 className="title">{type}</h1>
						{!teams && <TeamsNumber onSetTeamsNumber={setTeamsNumber} />}
						{teams &&
							!tables && <TableSorter teams={teams} setsNumber={setsNumber} onSetTables={setTables} />}
						{tables && (
							<div className="score-table">
								<Tabs>
									<table className="table" id="Tables">
										<thead>
											<tr>
												<th>Table</th>
												{tables[0].rounds.map((round, index) => <th>Partie {index + 1}</th>)}
											</tr>
										</thead>
										<tbody>
											{tables.map(table => (
												<tr key={table.id}>
													<td>{table.name}</td>
													{table.rounds.map(round => (
														<td key={`r${round[0].id}${round[1].id}`}>
															{`${round[0].name} / ${round[1].name}`}
														</td>
													))}
												</tr>
											))}
											{!!remaining && (
												<tr className="hat">
													<td className="hat-title">Chapeau</td>
													{remaining.map(remain => <td key={remain.id}>{remain.name}</td>)}
												</tr>
											)}
										</tbody>
									</table>
									<div id="Equipes">
										<button
											className={classNames('button sort-rank', { selected: sortedByScore })}
											onClick={toggleSort}
										>
											Trier par score
										</button>
										<table className="table" id="Equipes">
											<thead>
												<tr>
													<th>Equipe</th>
													<th>Tour de table</th>
													{partiesHeaders(setsNumber)}
													<th>Parties gagnées</th>
													<th>Total points</th>
													<th>Classement</th>
												</tr>
											</thead>
											<tbody>
												{displayedTeams.map((team, index) => (
													<tr key={team.id}>
														<td>{team.name}</td>
														<td className="table-turn">
															<input
																type="text"
																data-id={team.id}
																value={team.tableTurn}
																onChange={setTableTurn}
															/>
														</td>
														{team.sets.map((set, index) => {
															const key = `${team.id}_${index}`;
															const isWon = set === 'w';
															const isLost = set === 'l';
															return (
																<td
																	key={key}
																	className={classNames('set', {
																		won: isWon,
																		lost: isLost
																	})}
																>
																	<button
																		className="button status"
																		data-id={team.id}
																		data-set={index}
																		onClick={setWon}
																	>
																		Gagné
																	</button>
																	<button
																		className="button status"
																		data-id={team.id}
																		data-set={index}
																		onClick={setLose}
																	>
																		Perdu
																	</button>
																</td>
															);
														})}
														<td>{getWonSets(team)}</td>
														<td>{getTotal(team, type)}</td>
														<td>{sortedTeams.indexOf(team) + 1}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</Tabs>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}
