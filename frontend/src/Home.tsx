import { useState, useEffect } from "react";
import { useAppContext } from "./AppContext";
import Canvas from "./Canvas";
import TodoList from "./TodoList";
import axios from "axios";
import Todo from "./Todo";

export default function Home() {
  const { authToken } = useAppContext();
  const [todos, setTodos] = useState<Array<Todo>>([]);

  const makeTodo = (id: string, done: boolean, content: string) : Todo => {
    return {
      id,
      done,
      content,
    };
  };

  useEffect(() => {
    async function onLoad() {
      if (!authToken) return;

      const config = {
        headers: { Authorization: `Bearer ${authToken}`},
      };

      try {
        const res = await axios.get("http://127.0.0.1:3001/v1/todos", config);
        setTodos(res.data.map((todo: any) => makeTodo(todo._id, todo.done, todo.content)));
      } catch (error) {
        console.log(error);
      }
    }
    onLoad();
  }, [authToken]);

  const addTodo = async (content: string) => {

    const data = {
      content
    };

    const config = {
      headers: { Authorization: `Bearer ${authToken}`},
    };

    try {
      const res = await axios.post("http://127.0.0.1:3001/v1/todos", data, config);
      setTodos([...todos, makeTodo(res.data.result, false, content)]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id: string) => {

    const config = {
      headers: { Authorization: `Bearer ${authToken}`},
    };

    try {
      await axios.delete(`http://127.0.0.1:3001/v1/todos/${id}`, config);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const updateTodo = async (id: string, done: boolean, content: string) => {
    const data = {
      done,
      content,
    };

    const config = {
      headers: { Authorization: `Bearer ${authToken}`},
    };

    try {
      await axios.put(`http://127.0.0.1:3001/v1/todos/${id}`, data, config);
      setTodos(todos.map(todo => (todo.id === id) ? makeTodo(id, done, content) : todo));
    } catch (error) {
      console.log(error);
    }
  };

  const renderHome = () => {
    return (
      <div>
        <Canvas todos={todos}/>
        <TodoList todos={todos} onAdd={addTodo} onDelete={deleteTodo} onUpdate={updateTodo} />
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
