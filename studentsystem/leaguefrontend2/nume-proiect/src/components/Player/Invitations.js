import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Invitations.css';

const Invitations = ({ token }) => {
  const [invitations, setInvitations] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userTeam, setUserTeam] = useState(''); 
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
        setUserTeam(userProfile.player.team.name);
        setTeamName(userProfile.player.team.name);
      }
      setProfile(userProfile);
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
    }
  }, [userId, token]);

  const handleAccept = (invitationId) => {
    axios.post(`http://localhost:8080/player/invitations/${invitationId}/accept`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        setInvitations([]);
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
      setErrorMessage('Failed to send invitation: ' + error.message);
    });
  };

  return (
    <div className="invitationsContainer">
      <h3 className="sectionHeader">Your Invitations</h3>
      {invitations.length > 0 ? (
        invitations.map(invitation => (
          <div key={invitation.id} className="invitationItem">
            <p>Invitation from {invitation.senderName}</p>
            <div className="invitationActions">
              <button className="button buttonAccept" onClick={() => handleAccept(invitation.id)}>Accept</button>
              <button className="button buttonReject" onClick={() => handleReject(invitation.id)}>Reject</button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending invitations.</p>
      )}

      <h3 className="sectionHeader">Send an Invitation</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
      <input
        type="text"
        className="inputField"
        value={teamName}
        placeholder="Team Name"
        readOnly // Make this field read-only since it should auto-populate
      />
      <input
        type="email"
        className="inputField"
        value={inviteeEmail}
        onChange={(e) => setInviteeEmail(e.target.value)}
        placeholder="Invitee Email"
      />
      <button className="button buttonSend" onClick={handleSendInvitation}>Send Invitation</button>
    </div>
  );
};

export default Invitations;
