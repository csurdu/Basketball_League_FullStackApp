import React, { useState } from 'react';

export default function PlayerForm() {
    const [name, setName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchTeam, setSearchTeam] = useState('');
    const [playerResult, setPlayerResult] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        const player = { name, team: { name: teamName } };
        fetch("http://localhost:8080/player/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(player)
        })
        .then(response => response.json())
        .then(data => {
            console.log("New player added", data);
        })
        .catch(error => console.error('Error:', error));
    };

    const handleSearch = () => {
        const url = `http://localhost:8080/player/search?name=${encodeURIComponent(searchName)}&teamName=${encodeURIComponent(searchTeam)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setPlayerResult(data);
            })
            .catch(error => {
                console.error('Search failed:', error);
                setPlayerResult(null);
            });
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Player Form</h2>
            <form className="space-y-4">
                <div>
                    <label htmlFor="player-name" className="block text-gray-700">Player Name</label>
                    <input 
                        id="player-name" 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="team-name" className="block text-gray-700">Player Team</label>
                    <input 
                        id="team-name" 
                        type="text" 
                        value={teamName} 
                        onChange={(e) => setTeamName(e.target.value)} 
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button 
                    type="button" 
                    onClick={handleClick} 
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                    Add Player
                </button>
            </form>

            <h3 className="text-xl font-bold mt-8 mb-4 text-gray-700 text-center">Search Player</h3>
            <form className="space-y-4">
                <div>
                    <label htmlFor="search-player-name" className="block text-gray-700">Search Player Name</label>
                    <input 
                        id="search-player-name" 
                        type="text" 
                        value={searchName} 
                        onChange={(e) => setSearchName(e.target.value)} 
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="search-team-name" className="block text-gray-700">Search Player Team</label>
                    <input 
                        id="search-team-name" 
                        type="text" 
                        value={searchTeam} 
                        onChange={(e) => setSearchTeam(e.target.value)} 
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button 
                    type="button" 
                    onClick={handleSearch} 
                    className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                >
                    Search Player
                </button>
            </form>
            
            {playerResult && (
                <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
                    <h4 className="text-lg font-bold text-gray-700">Player Information</h4>
                    <p className="text-gray-700">Player Name: {playerResult.name}</p>
                    <p className="text-gray-700">Team: {playerResult.team?.name}</p>
                    <p className="text-gray-700">Height: {playerResult.height}</p>
                </div>
            )}
        </div>
    );
}
