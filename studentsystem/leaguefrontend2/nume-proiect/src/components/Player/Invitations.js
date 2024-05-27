import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Invitations.css';

const Invitations = ({ token }) => {
  const [invitations, setInvitations] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [userId, setUserId] = useState(null); // To store user ID

  useEffect(() => {
    axios.get('http://localhost:8080/user/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setUserId(response.data.id); // Assuming user ID is in the response
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
        // Assuming the backend effectively handles rejecting or marking other invitations as irrelevant
        // We clear the invitations list, assuming no pending invitations should be shown after accepting one
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
      setTeamName('');
      setInviteeEmail('');
    })
    .catch(error => console.error("Failed to send invitation", error));
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
      <input
        type="text"
        className="inputField"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Team Name"
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
