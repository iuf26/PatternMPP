import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { LOGIN_REQUEST } from './routes/routes';
import BoardGame from './components/BoardGame';
//Aici e main-ul
function App() {
  const [board,setBoard] = useState([]);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [alias,setAlias] = useState("");
  function doLogin(){
    axios.get(LOGIN_REQUEST, {
      params: {
        alias: alias
      }
    })
    .then(function (response) {
      
      if(response.status == 200){
      console.log(response.data.data.board);
      setBoard(response.data.data.board)

      setIsLoggedIn(true);  
      }
      else{
        setIsLoggedIn(false); 
      }
    })
    .catch(error => {
        console.log(error);
    })
  
  }

  function goSetAlias(event){
    setAlias(event.target.value);
  }

  return (<>
    <input  onChange={goSetAlias}></input>
    <button onClick={doLogin}> Log in</button>
    {isLoggedIn? <BoardGame info={board.values} alias = {alias} currentGameId = {board.currentGameId}/> : null}
 
    
    </>
  );
}

export default App;
