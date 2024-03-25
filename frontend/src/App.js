import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [message, setMessage] = useState("Nothing to show");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onLoad = async () => {
      setIsLoading(true);

      try {
        const res = await fetch("http://localhost:3001/", {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
        const msg = await res.json();
        setMessage(JSON.stringify(msg));
      } catch (e) {
        console.log("error");
      } finally {
        setIsLoading(false);
      }
    }

    onLoad();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {isLoading ? "Loading..." : message}
      </header>
    </div>
  );
}

export default App;
