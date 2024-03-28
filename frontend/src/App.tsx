import Canvas from "./Canvas";
import TodoList from "./TodoList";
import './App.css';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        Todo App
      </header>
      <div className="App-body">
        <Canvas />
        <TodoList />
      </div>
    </div>
  );
}
