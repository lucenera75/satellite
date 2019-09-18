import React from "react";
import AppContext from "./AppContext";
import TodoItem from "./TodoItem";
import TodoEdit from "./TodoEdit";
import ReactModal from 'react-modal';

export default () => {
  const context = React.useContext(AppContext);

  return (
    <ReactModal
    isOpen={context.currentTodoId}
    onRequestClose={() => context.setCurrentTodoId(false)}
    ariaHideApp={false}
    >
      <button style={{float:"right"}} className="btn btn-info"
      onClick={() => context.setCurrentTodoId(false)}
      >X</button>
      <TodoEdit />
    </ReactModal>
  );
};
