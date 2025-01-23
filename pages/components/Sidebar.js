//src/components/Sidebar.js

import React from "react";
import { Link } from "react-router-dom";


const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/chat-admin">Chat Admin</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

