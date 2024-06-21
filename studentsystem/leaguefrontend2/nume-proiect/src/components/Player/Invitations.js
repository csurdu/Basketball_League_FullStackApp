import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Invitations = ({ token }) => {
  const [invitations, setInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]); // State for sent invitations
  const [teamName, setTeamName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [isCaptain, setIsCaptain] = useState(false); // State to check if the user is a team captain
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  useEffect(() => {
    axios.get('http://localhost:8080/user/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      const userProfile = response.data;
      setUserId(userProfile.id);
      if (userProfile.player && userProfile.player.team) {
        setTeamName(userProfile.player.team.name);
        setIsCaptain(userProfile.player.captain); // Check if the user is a team captain
      }
    })
    .catch(error => console.error("Error loading user data", error));
  }, [token]);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/player/invitations/${userId}/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setInvitations(response.data);
      })
      .catch(error => console.error("Error loading invitations", error));

      axios.get(`http://localhost:8080/player/${userId}/sent-invitations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setSentInvitations(response.data);
      })
      .catch(error => console.error("Error loading sent invitations", error));
    }
  }, [userId, token]);

  const handleAccept = (invitationId) => {
    axios.post(`http://localhost:8080/player/invitations/${invitationId}/accept`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(() => {
        setInvitations(invitations.filter(inv => inv.id !== invitationId));
        alert('Invitation accepted!');
    })
    .catch(error => {
        console.error("Failed to accept invitation", error);
        alert('Failed to accept invitation: ' + error.message);
    });
  };

  const handleReject = (invitationId) => {
    axios.post(`http://localhost:8080/player/invitations/${invitationId}/reject`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      alert('Invitation rejected');
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    })
    .catch(error => console.error("Failed to reject invitation", error));
  };

  const handleSendInvitation = () => {
    axios.post(`http://localhost:8080/player/sendInvitation/${inviteeEmail}/toTeam/${teamName}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      alert('Invitation sent successfully to ' + inviteeEmail);
      setInviteeEmail('');
      setErrorMessage(''); // Clear any previous error message
    })
    .catch(error => {
      console.error("Failed to send invitation", error);
      if (error.response && error.response.status === 403) {
        setErrorMessage('Not authorized to send invitation');
      } else {
        setErrorMessage('Failed to send invitation: ' + error.message);
      }
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Your Invitations</h3>
      {invitations.length > 0 ? (
        invitations.map(invitation => (
          <div key={invitation.id} className="mb-4 p-4 border rounded-lg bg-gray-100">
            <p className="text-gray-700">Invitation from <span className="font-semibold">{invitation.sender.team.name}</span></p>
            <div className="flex justify-end mt-2 space-x-2">
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => handleAccept(invitation.id)}>Accept</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleReject(invitation.id)}>Reject</button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-700">No pending invitations.</p>
      )}

      <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Send an Invitation</h3>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Display error message */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Team Name</label>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={teamName}
          readOnly // Make this field read-only since it should auto-populate
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Invitee Email</label>
        <input
          type="email"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inviteeEmail}
          onChange={(e) => setInviteeEmail(e.target.value)}
          placeholder="Invitee Email"
        />
      </div>
      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300" onClick={handleSendInvitation}>Send Invitation</button>

      {sentInvitations.length > 0 && (
        <>
          <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Sent Invitations</h3>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">Invitee Name</th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">Team</th>
                <th className="py-2 px-4 text-left text-gray-700 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {sentInvitations.map(invitation => (
                <tr key={invitation.id} className="border-b last:border-none">
                  <td className="py-2 px-4">{invitation.player.firstName} {invitation.player.lastName}</td>
                  <td className="py-2 px-4">{invitation.team.name}</td>
                  <td className="py-2 px-4">{invitation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Invitations;
