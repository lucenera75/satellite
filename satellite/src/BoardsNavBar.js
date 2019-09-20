import React from "react";
import AppContext from "./AppContext";

export default () => {
  const context = React.useContext(AppContext);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul class="navbar-nav">
        {context.availableBoards.map(b => {
          debugger
          return (
            <li className="nav-item">
              <a className="nav-link" href={`/${b}`}>
                {b}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
