import React, { useState } from "react";
import Todo from "./Todo";

type Props = {
  todos: Todo[];
  onAdd: (content: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, done: boolean, content: string) => void;
}

export default function TodoList({ todos, onAdd, onDelete, onUpdate }: Props) {

  const [text, setText] = useState("");

  const handleTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value);
  };

  const handleSubmit = () => {
    if (text) onAdd(text);
  };

  return (
    <div style={{ border: "1px solid red", width: "400px" }}>
      <div style={{ height: "2em" }}>Your TODOs</div>
      <hr />
      <div style={{ height: "2em", display: "flex" }}>
        <input type="text" onChange={handleTextChange} style={{ flexGrow: 1, marginLeft: "5px", marginRight: "5px" }} />
        <input type="button" onClick={handleSubmit} value="Add" style={{ float: "right" }} />
      </div>
      <hr />
      {todos.map( todo => 
        <div key={todo.id} style={{ width: "100%", display: "flex", justifyContent: "space-between", color: todo.done ? "grey" : "black" }}>
          <input type="checkbox" id={todo.id} checked={todo.done} onChange={(event) => onUpdate(todo.id, event.target.checked, todo.content)} />
          <span style={{ padding: "5px" }}>{todo.content}</span>
          <input type="button" onClick={() => onDelete(todo.id)} value="delete" />
        </div>
      )}
    </div>
  );
}
