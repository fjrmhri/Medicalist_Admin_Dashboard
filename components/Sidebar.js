//Sidebar.js

import React from 'react';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <button className="button bar">🏠</button>
                </li>
                <li>
                    <button className="button bar">💊</button>
                </li>
                <li>
                    <button className="button bar">🦠</button>
                </li>
                <li>
                    <button className="button bar">🩺</button>
                </li>
                <li>
                    <button className="button bar">🏥</button>
                </li>   
            </ul>
        </div>
    );
};

export default Sidebar;
