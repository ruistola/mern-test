import { useEffect, useState } from "react";
import { AppContext, AppContextType } from "./AppContext";
import Routes from "./Routes";
import './App.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const nav = useNavigate();

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      localStorage.setItem("token", authToken);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [authToken]);

  const handleSignup = () => {
    nav("/signup");
  };

  const handleLogin = () => {
    nav("/login");
  };

  const handleLogout = () => {
    setAuthToken("");
    nav("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        Todo App
        {authToken ?
          (<button onClick={handleLogout}>Log out</button>) :
          (<>
            <button onClick={handleSignup}>Sign up</button>
            <button onClick={handleLogin}>Log in</button>
          </>)
        }
      </header>
      <div className="App-body">
        <AppContext.Provider value={{ authToken, setAuthToken } as AppContextType} >
          <Routes />
        </AppContext.Provider>
      </div>
    </div>
  );
}
