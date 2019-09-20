import React from "react";
import "./App.css";
import AppContext from "./AppContext";
import axios from "axios";
import Board from "./Board";
import {addToSearch, removeFromSearch, search} from "./Searcher";
import getCumulativeValue from "./getCumulativeValue"
import BoardsNavBar from  "./BoardsNavBar"
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

const loadBoards = async () => {
  const boards = await axios.get(
    `${process.env.REACT_APP_SAT_BASE_URL}/boards`
  );
  return boards.data;
}
const boardId = window.location.pathname.substr(1) || "1"
let isNew = false
const loadBoard = async () => {
  let board = {
    todos: {},
    metadata: {}
  }
  try {
    board = (await axios.get(
      `${process.env.REACT_APP_SAT_BASE_URL}/boards/${boardId}`
    )).data;
    isNew = false
  } catch (err) {
    alert("creating")
    console.log(err)
    isNew = true
  }
  return board;
};
const saveBoard = async board => {
  if (isNew) {
    board.id=boardId
    await axios.post(
      `${process.env.REACT_APP_SAT_BASE_URL}/boards`,
      board
    );
    isNew = false
  } else {
    await axios.put(
      `${process.env.REACT_APP_SAT_BASE_URL}/boards/${boardId}`,
      board
    );
  }
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
      availableBoards: [],
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
      createNewTodo: (title, flush=true) => {
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
        if (flush) {
          this.state.addTodo(todo);
        }
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
      refreshWeights: () => {
        Object.values(this.state.board.todos).forEach(todo => {
          todo.weight = getCumulativeValue(todo.id, Object.values(this.state.board.todos))
        })
        this.state.setBoard({...this.state.board})
      },
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
    const board = await loadBoard();
    Object.values(board.todos).forEach(t => addToSearch(t.id, t.title))
    this.lastCheckpoint = JSON.stringify(board);
    this.state.setBoard(board);
    this.setState({boardLoaded:true})
    if (isNew) {
      const firstTodo = this.state.createNewTodo("do something amazing", false)
      this.state.addTodo(firstTodo);
    }
    loadBoards().then(boards => {
      this.setState({availableBoards: boards.map(b => b.id)})
    })
    setInterval(() => {
      if (!this.state.boardLoaded) {return}
      if (JSON.stringify(this.state.board) !== this.lastCheckpoint) {
        this.state.refreshWeights()
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
        <BoardsNavBar />
        <Board />
      </AppContext.Provider>
    );
  }
}

export default App;
