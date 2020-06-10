/* src/App.js */
import React, { useState } from 'react'

import { withAuthenticator } from '@aws-amplify/ui-react'
import 'cross-fetch/polyfill';
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";

import aws_exports from './aws-exports.js';

const poolData = {UserPoolId: aws_exports.aws_user_pools_id, ClientId: aws_exports.aws_user_pools_web_client_id};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const cognitoUser = userPool.getCurrentUser();

console.log('loadAccountData() cognitoUser', cognitoUser);  

var token;

if (cognitoUser != null) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.log(err);
      } else if (!session.isValid()) {
        console.log("Invalid session.");
      } else {
        token = session.getIdToken().getJwtToken();
        console.log("IdToken: " + token);
      }
    });
  } else {
    console.log("User not found.");
  }

const initialState = { InValue: 1962 }

const App = () => {
  const [formState, setFormState] = useState(initialState)


  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function doRestCall() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(formState)
  };
  console.log('doRestCall requestOptions', requestOptions);

  fetch('https://4nn3vo9ru4.execute-api.us-east-1.amazonaws.com/prod/calc', requestOptions)
      .then(response => {
        console.log("fetch response", response);
        return response.json()
      }
      )
      .then(data => document.getElementById('fred').innerHTML = data.OutValue );  
  
  }

  return (
    <div style={styles.container}>
      <h2>Lambda REST call with authorisation</h2>
      <h5 id="fred">Initial</h5>
      <input
        onChange={event => setInput('InValue', event.target.value)}
        style={styles.input}
        value={formState.InValue} 
        placeholder="1962"
      />
      <button style={styles.button} onClick={doRestCall}>Call Lambda Calculation</button>
     </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App)