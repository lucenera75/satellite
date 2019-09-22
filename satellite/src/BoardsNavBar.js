import React from "react";
import AppContext from "./AppContext";

export default () => {
  const context = React.useContext(AppContext);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul class="navbar-nav">
        <li>
        <a className="nav-link" href={`/${new Date().toISOString()}`}>
                +
              </a>
        </li>
        {context.availableBoards.map(b => {          
          return (
            <li className={"nav-item " + (b === context.board.id ? "active" : " ")}>
              <a className="nav-link" href={`/${b.id}`}>
                {b.name || b.id}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
