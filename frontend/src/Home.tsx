import { useState, useEffect } from "react";
import { useAppContext } from "./AppContext";
import Canvas from "./Canvas";
import TodoList from "./TodoList";
import axios from "axios";

export default function Home() {
  const { authToken } = useAppContext();
  const [todos, setTodos] = useState([]);

  const loadTodos = async () => {
      const config = {
        headers: { Authorization: `Bearer ${authToken}`},
      };

      const res = await axios.get("http://127.0.0.1:3001/v1/todos", config);
      setTodos(res.data.map((todo: any) => ({ id: todo._id, done: todo.done, content: todo.content })));
  };

  useEffect(() => {
    async function onLoad() {
      if (!authToken) return;
      await loadTodos();
    }
    onLoad();
  }, [authToken]);

  const renderHome = () => {
    return (
      <div>
        <Canvas todos={todos}/>
        <TodoList todos={todos}/>
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
