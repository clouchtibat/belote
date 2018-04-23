import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './themify-icons.css';
import './index.css';

// if (process.env.NODE_ENV !== 'production') {
//     // eslint-disable-next-line no-unused-vars,react/no-deprecated
//     let createClass = React.createClass;
//     Object.defineProperty(React, 'createClass', {
//         set: nextCreateClass => {
//             createClass = nextCreateClass;
//         },
//     });
//     /* eslint-disable global-require */
//     /* eslint-disable import/no-extraneous-dependencies */
//     const { whyDidYouUpdate } = require('why-did-you-update');
//     whyDidYouUpdate(React, { exclude: /^Connect|Field/ });
// }

/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
