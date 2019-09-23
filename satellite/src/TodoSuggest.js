import React from "react";
import AppContext from "./AppContext";
import Autosuggest from "react-autosuggest";
import { addToSearch, removeFromSearch, search } from "./Searcher";
import recursiveCheck from "./recusiveCheck";
// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.title || "";

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion.title || ""}</div>;

export default class TodoSuggest extends React.Component {
  static contextType = AppContext;
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: []
    };
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  
  getSuggestions = async value => {
    const ids = await search(value);
    return ids
      .filter(
        id =>
          this.context.board.todos[id].active &&
          id !== this.context.getCurrentTodo().id
      )
      .map(id => this.context.board.todos[id]);
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = async ({ value }) => {
    this.setState({
      suggestions: await this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      className: "form-control",
      style: { wordBreak: "break-word" },
      placeholder: "...",
      value,
      onChange: this.onChange,
      onKeyPress: e => {
        // console.log("key ",e.key)
        if (e.key === "Enter") {
          // console.log(this.suggestion,this.state.value)
          const todo = this.context.getCurrentTodo();
          let newDepId = false;
          if (this.suggestion) {
            newDepId = this.suggestion.id;
            this.suggestion = false;
          } else {
            const newTodo = this.context.createNewTodo(value);
            newDepId = newTodo && newTodo.id;
          }
          if (!newDepId) {
            return;
          }
          todo.dependsOn.push(newDepId);
          this.context.updateTodo(todo, () => {
            try {
              recursiveCheck(todo.id, this.context.board.todos);
            } catch (err) {
              alert(err);
              todo.dependsOn = todo.dependsOn.filter(tid => tid !== newDepId);
              this.context.updateTodo(todo);
            }
          });
          this.setState({value:""})
        }
        // if (e.key === 'Delete') {
        //   context.removeTodo(todo)
        // }
      }
    };

    // Finally, render it!
    console.log(value);
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={(e, { suggestion }) => {
          this.suggestion = suggestion;
        }}
      />
    );
  }
}
