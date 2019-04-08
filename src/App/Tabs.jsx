import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Tabs extends Component {
	constructor(props) {
		super();

		this.state = {
			currentId: props.children[0].props.id
		};
	}

	setCurrentId = e => {
		this.setState({
			...this.state,
			currentId: e.target.dataset.id
		});
	};

	render() {
		const { setCurrentId } = this;
		const { children } = this.props;
		const { currentId } = this.state;

		return (
			<div className="tabs">
				<div className="header">
					{children.map(child => (
						<button
							key={child.props.id}
							className={classNames('button handle', { selected: currentId === child.props.id })}
							data-id={child.props.id}
							onClick={setCurrentId}
						>
							{child.props.id}
						</button>
					))}
				</div>
				<div className="body">
					{children.map(child => (
						<div
							key={child.props.id}
							className={classNames('tab', { visible: currentId === child.props.id })}
						>
							{child}
						</div>
					))}
				</div>
			</div>
		);
	}
}

Tabs.propTypes = {
	children: PropTypes.arrayOf(PropTypes.shape({ props: PropTypes.shape({ id: PropTypes.string.isRequired }) }))
		.isRequired
};
