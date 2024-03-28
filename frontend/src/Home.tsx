import { useEffect } from "react";
import { useAppContext } from "./AppContext";
import Canvas from "./Canvas";
import TodoList from "./TodoList";

export default function Home() {
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) return;
    }
    onLoad();
  }, [isAuthenticated]);

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
    isAuthenticated ? renderHome() : renderLandingPage()
  );
}
