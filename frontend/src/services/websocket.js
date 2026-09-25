import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Use environment variable for the WS URL, or default to localhost for local dev
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

export const createStompClient = (onConnect) => {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  client.onConnect = (frame) => {
    console.log('Connected to WS');
    if (onConnect) onConnect(client);
  };

  client.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  return client;
};
