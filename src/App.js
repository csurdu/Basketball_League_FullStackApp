import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfile from './pages/UserProfile';
import PlayerStats from './pages/PlayerStats';
import Teams from './pages/Teams';
import CreateTeam from './pages/CreateTeam';
import SimulateGame from './pages/SimulateGame';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/user-profile' element={<UserProfile />} />
                <Route path='/player-stats' element={<PlayerStats />} />
                <Route path='/teams' element={<Teams />} />
                <Route path='/create-team' element={<CreateTeam />} />
                <Route path='/simulate-game' element={<SimulateGame />} />
            </Routes>
        </Router>
    );
}

export default App;