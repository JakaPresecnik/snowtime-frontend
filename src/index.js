import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import './index.css';
import App from './App';

ReactDOM.render(
  <Auth0Provider
    domain="dev-bfn-8r1t.eu.auth0.com"
    clientId="aCF7OxPib5Ynx0pcUWLvRVoPHPWp1u40"
    redirectUri={window.location.origin}
    audience="resorts"
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

