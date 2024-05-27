const WebSocket = require('ws');

// URL-ul serverului WebSocket
const websocketUrl = 'ws://localhost:8080/ws'; // Înlocuiește cu URL-ul corect al serverului tău WebSocket

// Creează o nouă conexiune WebSocket
const ws = new WebSocket(websocketUrl);

// La deschiderea conexiunii WebSocket
ws.on('open', function open() {
  console.log('Conexiune WebSocket deschisă.');
  
  // Trimite două mesaje către server
  ws.send('Primul mesaj');
  ws.send('Al doilea mesaj');
});

// La primirea unui mesaj WebSocket
ws.on('message', function incoming(data) {
  console.log('Mesaj primit:', data);
});

// La închiderea conexiunii WebSocket
ws.on('close', function close() {
  console.log('Conexiune WebSocket închisă.');
});

// La apariția unei erori în conexiunea WebSocket
ws.on('error', function error(error) {
  console.error('Eroare WebSocket:', error);
});
