import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to='/user-profile'>User Profile</Link></li>
                <li><Link to='/player-stats'>Player Stats</Link></li>
                <li><Link to='/teams'>Teams</Link></li>
                <li><Link to='/create-team'>Create Team</Link></li>
                <li><Link to='/simulate-game'>Simulate Game</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;