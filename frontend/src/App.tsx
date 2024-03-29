import { useEffect, useState } from "react";
import { AppContext, AppContextType } from "./AppContext";
import Routes from "./Routes";
import './App.css';
import { useNavigate } from "react-router-dom";

export default function App() {
  const [authToken, setAuthToken] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    // TODO: Load saved token and authenticate silently if possible
    setAuthToken("");
  }, []);

  const handleSignup = () => {
    nav("/signup");
  };

  const handleLogin = () => {
    nav("/login");
  };

  const handleLogout = () => {
    // TODO: Delete saved token
    setAuthToken("");
    nav("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        Todo App
        {authToken != "" ?
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
