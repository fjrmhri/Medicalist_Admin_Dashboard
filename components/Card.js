//Card.js

import React from 'react';

const Card = ({ color, icon, title }) => {
    return (
        <div className="card" style={{ backgroundColor: color }}>
            <img src={icon} alt={title} />
            <h3>{title}</h3>
        </div>
    );
};

export default Card;
