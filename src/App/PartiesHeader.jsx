import React from 'react';

export default function PartiesHeader(number) {
    return [...Array(number).keys()].map((i, index) => index + 1).map(
        p => (
            <th key={p}>Partie {p}</th>
        ),
    );
}

