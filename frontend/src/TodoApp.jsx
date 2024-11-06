import { useState, useEffect } from "react";
import "./index.css";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  function fetchTodos() {
    fetch("http://localhost:8080/todos")
      .then((response) => response.json())
      .then(setTodos)
      .catch(console.error);
  }

  function addTodo() {
    if (!newTodo.trim()) return;
    fetch("http://localhost:8080/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTodo }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewTodo("");
      })
      .catch(console.error);
  }

  function completedTodoTask(id, completed) {
    fetch(`http://localhost:8080/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedTodos = todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: !completed };
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch(console.error);
  }

  function deleteTodoTask(id) {
    fetch(`http://localhost:8080/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        const filteredTodos = todos.filter((todo) => todo.id !== id);
        setTodos(filteredTodos);
      })
      .catch(console.error);
  }

  return (
    <>
      <div className="wrapper">
        <div className="mini-wrapper">
          <h1>To-do List</h1>
          <input
            className="search-input"
            type="text"
            value={newTodo}
            placeholder="New task"
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
          />
          <button className="add-btn" onClick={addTodo}>
            Add task
          </button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                <label className="container">
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => completedTodoTask(todo.id, todo.completed)}
                  />
                  <span className="checkmark"></span>
                </label>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                    textDecorationColor: todo.completed ? "#fba5e1" : "#000000",
                    flexGrow: 2,
                  }}
                >
                  {todo.title}
                </span>
                <button
                  className="remove-btn"
                  onClick={() => deleteTodoTask(todo.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default TodoApp;
