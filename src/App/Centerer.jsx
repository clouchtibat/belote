import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './app.scss';

export default function Centerer({ className, children }) {
    return (
        <div className={classNames('centerer', className)}>
            <div className="centered">{children}</div>
        </div>
    );
}

Centerer.defaultProps = {
    className: '',
};

Centerer.propTypes = {
    className: PropTypes.string,
    children: PropTypes.string.isRequired,
};

