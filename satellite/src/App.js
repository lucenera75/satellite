import React from "react";
import "./App.css";
import AppContext from "./AppContext";
import axios from "axios";
import Board from "./Board";
import {addToSearch, removeFromSearch, search} from "./Searcher";

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
  const board = await axios.get(
    `${process.env.REACT_APP_SAT_BASE_URL}/boards/1`
  );
  return board;
};
const saveBoard = async board => {
  const result = await axios.put(
    `${process.env.REACT_APP_SAT_BASE_URL}/boards/1`,
    board
  );
  // console.log(result)
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.lastCheckpoint = false;
    this.state = {
      endpoint: process.env.REACT_APP_SAT_BASE_URL,
      board: {
        todos: {},
        metadata: {}
      },
      filteredIds: [],
      searchTerms: "",
      setSearchTerms: (searchTerms) => {
        this.setState({searchTerms})
        search(searchTerms).then(filteredIds => this.setState({filteredIds}))
      },
      currentTodo: false,
      createAndEditNewTodo: () => {
        const todo = this.state.createNewTodo("");
        this.state.setCurrentTodoId(todo.id);
      },
      createNewTodo: title => {
        const todo = {
          id: new Date().getTime(),
          dateCreate: new Date().getTime(),
          lastUpdate: new Date().getTime(),
          dateCompleted: false,
          title: title,
          description: "",
          active: true,
          dependsOn: []
        };
        this.state.addTodo(todo);
        return todo;
      },
      getCurrentTodo: () => {
        return this.state.currentTodoId && this.state.board.todos[this.state.currentTodoId];
      },
      setCurrentTodoId: todoId => {
        console.log("setting todo id", todoId)
        debugger
        this.setState({ currentTodoId: todoId });
      },
      setBoard: (board,cb) => this.setState({ board },cb),
      addTodo: todo => {
        const board = { ...this.state.board };
        board.todos[todo.id] = todo;
        addToSearch(todo.id, todo.title);
        this.state.setBoard(board);
      },
      removeTodo: todo => {
        const board = { ...this.state.board };
        delete board.todos[todo.id];
        removeFromSearch(todo.id);
        this.state.setBoard(board);
      },
      updateTodo: (todo,cb) => {
        const board = { ...this.state.board };
        todo.lastUpdate = new Date().getTime();
        board.todos[todo.id] = todo;
        addToSearch(todo.id, todo.title);
        this.state.setBoard(board,cb);
      }
    };
  }

  async componentDidMount() {
    const board = (await loadBoard()).data;
    Object.values(board.todos).forEach(t => addToSearch(t.id, t.title))
    this.lastCheckpoint = JSON.stringify(board);
    this.state.setBoard(board);
    this.setState({boardLoaded:true})
    setInterval(() => {
      if (!this.state.boardLoaded) {return}
      if (JSON.stringify(this.state.board) !== this.lastCheckpoint) {
        console.log("committing changes");
        saveBoard(this.state.board);
        this.lastCheckpoint = JSON.stringify(this.state.board);
      } else {
        console.log("no changes");
      }
    }, 3000);
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
