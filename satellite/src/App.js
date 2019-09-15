import React from "react";
import "./App.css";
import AppContext from "./AppContext";
import axios from "axios";
import Board from "./Board";

/*
 *
 * board: {
 *  todos: {
 *    10001: {id: 10001, title: "jlh", summary: "udgkwdck", dependsOn: [10002,10003,...]},
 *    10002: {id: 10001, title: "jlh", summary: "udgkwdck", dependsOn: [10004,10005,...]},
 *    ...
 *  }
 *  metedata: {}
 * }
 *
 * when load first this is to load a board and invoke setBoard
 */

const loadBoard = async () => {
  const board = await axios.get("http://localhost:9898/boards/1");
  return board;
};
const saveBoard = async board => {
  const result = await axios.put("http://localhost:9898/boards/1", board);
  // console.log(result)
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: {
        todos: {},
        metadata: {}
      },
      currentTodo: false,
      createAndEditNewTodo: () => {
        const todo = {
          id: new Date().getTime(),
          title: "",
          description: "",
          active: true,
          dependsOn: []
        };
        this.state.addTodo(todo);
        this.state.setCurrentTodoId(todo.id);
      },
      getCurrentTodo: () => {
        return this.state.board.todos[this.state.currentTodoId];
      },
      setCurrentTodoId: todoId => {
        this.setState({ currentTodoId: todoId });
      },
      setBoard: board => this.setState({ board }),
      addTodo: todo => {
        const board = { ...this.state.board };
        board.todos[todo.id] = todo;
        this.state.setBoard(board);
      },
      removeTodo: todo => {
        const board = { ...this.state.board };
        delete board.todos[todo.id];
        this.state.setBoard(board);
      },
      updateTodo: todo => {
        const board = { ...this.state.board };
        board.todos[todo.id] = todo;
        this.state.setBoard(board);
      }
    };
  }

  async componentDidMount() {
    const board = (await loadBoard()).data;
    console.log(board);
    this.state.setBoard(board);
    setInterval(() => saveBoard(this.state.board), 3000);
  }

  render() {
    if (!this.state.board) {
      return <div />;
    }
    return (
      <AppContext.Provider value={this.state}>
        <Board />
      </AppContext.Provider>
    );
  }
}

export default App;
