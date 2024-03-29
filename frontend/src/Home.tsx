import { useEffect } from "react";
import { useAppContext } from "./AppContext";
import Canvas from "./Canvas";
import TodoList from "./TodoList";

export default function Home() {
  const { authToken } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!authToken) return;
    }
    onLoad();
  }, [authToken]);

  const renderHome = () => {
    return (
      <div>
        <Canvas />
        <TodoList />
      </div>
    );
  };

  const renderLandingPage = () => {
    return (
      <div>
        Sign up or log in!
      </div>
    );
  };

  return (
    authToken ? renderHome() : renderLandingPage()
  );
}
