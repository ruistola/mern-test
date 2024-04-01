import Todo from "./Todo";

type Props = {
  todos: Todo[]
}

export default function TodoList({ todos }: Props) {
  return (
    <div style={{ border: "1px solid red", width: "400px" }}>
      <div style={{ height: "2em" }}>Todo list title</div>
      <hr />
      <div style={{ height: "1em" }}>New todo item row</div>
      <hr />
      {todos.map( todo => 
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <span style={{ paddingLeft: "5px" }}>{todo.done ? "X" : "O"}</span>
          <span style={{ paddingRight: "5px" }}>{todo.content}</span>
        </div>
      )}
    </div>
  );
}
