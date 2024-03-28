import { useEffect, useState } from "react";
import { AppContext, AppContextType } from "./AppContext";
import Routes from "./Routes";
import './App.css';
import { useNavigate } from "react-router-dom";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setIsAuthenticated(true);
  }, []);

  const handleSignup = () => {
    nav("/signup");
  };

  const handleLogin = () => {
    nav("/login");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    nav("/");
  };

  return (
    <div className="App">
      <header className="App-header">
        Todo App
      </header>
      <div className="App-body">
        <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated } as AppContextType} >
          <Routes />
        </AppContext.Provider>
      </div>
      {isAuthenticated ?
        (<button onClick={handleLogout}>Log out</button>) :
        (<>
          <button onClick={handleSignup}>Sign up</button>
          <button onClick={handleLogin}>Log in</button>
        </>)
      }
    </div>
  );
}
