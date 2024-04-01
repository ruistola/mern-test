import React, { useState } from "react";
import Todo from "./Todo";

type Props = {
  todos: Todo[];
  onTodoAdded: (content: string) => void;
  onCheckboxChanged: (id: string, checked: boolean) => void;
}

export default function TodoList({ todos, onTodoAdded, onCheckboxChanged }: Props) {

  const [text, setText] = useState("");

  const handleTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value);
  };

  const handleSubmit = () => {
    onTodoAdded(text);
  };

  return (
    <div style={{ border: "1px solid red", width: "400px" }}>
      <div style={{ height: "2em" }}>Your TODOs</div>
      <hr />
      <div style={{ height: "1em" }}>
        <input type="text" onChange={handleTextChange} />
        <input type="button" onClick={handleSubmit} value="Add Todo"/>
      </div>
      <hr />
      {todos.map( todo => 
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <input type="checkbox" id={todo.id} onChange={(event) => onCheckboxChanged(todo.id, event.target.checked)} />
          <span style={{ paddingRight: "5px" }}>{todo.content}</span>
        </div>
      )}
    </div>
  );
}
