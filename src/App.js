import logo from './logo.svg';
import './App.css';


async function getToken(code){
  var formBody = []
  formBody.push(encodeURIComponent('grant_type') + "=" + encodeURIComponent('authorization_code'))
  formBody.push(encodeURIComponent('code') + "=" + encodeURIComponent(code))
  formBody.push(encodeURIComponent('redirect_uri') + "=" + encodeURIComponent('https://forget-me-not.vercel.app/'))

  formBody = formBody.join("&")
  const response = await fetch('https://forget-me-not.auth.us-east-2.amazoncognito.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic NThtMDJoY2FpZXA0ZXM3bGozYWh0bjA1NjY6NG5hbmIzaTBkMGtzMnBmYm04YWZhdWdxampqbzJoZzBmbmt1dmF0cGFoOGRyajlxMjAz'
    },
    body: formBody
  })

  return response.json()
}

async function getCompanies() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + window.sessionStorage.getItem("id_token"));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://c1855ips20.execute-api.us-east-2.amazonaws.com/auth/company", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}
function App() {
  const queryParameters = new URLSearchParams(window.location.search)
  const code = queryParameters.get("code")
  if(code){
    getToken(code).then((data) => {
      console.log(data)
      if(!data.error){
        console.log("No error!")
        window.sessionStorage.setItem("id_token", data.id_token)
        window.sessionStorage.setItem("access_token", data.access_token)
        window.sessionStorage.setItem("refresh_token", data.refresh_token)
      }
    })
  }

  function logoutUser() {

    window.sessionStorage.setItem("id_token", null)
    window.sessionStorage.setItem("access_token", null)
    window.sessionStorage.setItem("refresh_token", null)
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <p>Code: {code}</p>
          <p>Token: {window.sessionStorage.getItem("id_token")}</p>
        </div>
        <a
          className="App-link"
          href="https://forget-me-not.auth.us-east-2.amazoncognito.com/oauth2/authorize?client_id=58m02hcaiep4es7lj3ahtn0566&response_type=code&scope=openid+profile&redirect_uri=https%3A%2F%2Fforget-me-not.vercel.app%2F"
          target="_blank"
          rel="noopener noreferrer"
        >
          Log in
        </a>
        <a
        onClick={logoutUser}
        target="_blank"
            href="https://forget-me-not.auth.us-east-2.amazoncognito.com/logout?client_id=58m02hcaiep4es7lj3ahtn0566&response_type=code&scope=openid+profile&redirect_uri=https%3A%2F%2Fforget-me-not.vercel.app%2F">
          Logout
        </a>
        <button onClick={getCompanies}>Get Companies</button>
      </header>
    </div>
  );
}

export default App;
