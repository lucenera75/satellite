import React from "react";
import AppContext from "./AppContext";
import TodoSuggest from "./TodoSuggest";
import Autosuggest from "react-autosuggest";

import "bootstrap/dist/css/bootstrap.min.css";

export default () => {
  const context = React.useContext(AppContext);
  const currentTodo = context.board.todos[context.currentTodoId];
  React.useEffect(() => {
    return () => {};
  });
  if (!currentTodo) {
    return (
      <div>
        <button
          className="btn btn-primary"
          onClick={() => context.createAndEditNewTodo()}
        >
          create new
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* {JSON.stringify(context.getCurrentTodo())} */}
      <button
        className="btn btn-primary"
        onClick={() => context.createAndEditNewTodo()}
      >
        create new
      </button>
      <hr />
      dependants:
      <div />
      {Object.values(context.board.todos)
        .filter(t => t.dependsOn.indexOf(context.getCurrentTodo().id) >= 0)
        .map(t => (
          <div key={t.id}>
            <a
              href={`#${t.id}`}
              onClick={e => {
                e.preventDefault();
                context.setCurrentTodoId(t.id);
              }}
            >
              {t.title}
            </a>
          </div>
        ))}
      <hr />
      <input
        type="text"
        className="form-control"
        autoFocus
        placeholder="title"
        onChange={e => {
          const todo = { ...context.getCurrentTodo() };
          todo.title = e.target.value;
          context.updateTodo(todo);
        }}
        value={context.getCurrentTodo().title}
      />
      <hr />
      <ul>
        <li>
          <TodoSuggest />
        </li>
        {context
          .getCurrentTodo()
          .dependsOn.filter(tid => context.board.todos[tid])
          .map(tid => {
            let className = "";
            if (context.board.todos[tid].active) {
              className += " text-success";
            } else {
              className += " text-muted text-line-through";
            }
            return (
              <li key={tid} className={className}>
                <button
                  onClick={() => {
                    const todo = context.getCurrentTodo();
                    todo.dependsOn = todo.dependsOn.filter(
                      _tid => _tid !== tid
                    );
                    context.updateTodo(todo);
                  }}
                >
                  x
                </button>
                <a
                  href={`#${tid}`}
                  onClick={e => {
                    e.preventDefault();
                    context.setCurrentTodoId(tid);
                  }}
                >
                  {context.board.todos[tid].title}
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
