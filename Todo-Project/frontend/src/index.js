import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import './index.css';


class TodoApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { items: [], text: '' };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    render() {
      return (
        <div>
          <h3>TODO</h3>
          <TodoList items={this.state.items} />
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="new-todo">
              What needs to be done?
            </label>
            <input
              id="new-todo"
              onChange={this.handleChange}
              value={this.state.text}
            />
            <button>
              Add #{this.state.items.length + 1}
            </button>
          </form>
        </div>
      );
    }
  
    handleChange(e) {
      this.setState({ text: e.target.value });
    }
  
    handleSubmit(e) {
      e.preventDefault();
      if (!this.state.text.length) {
        return;
      }
      const newtodo = {
        "title": this.state.text
      };
      console.log(newtodo)
      axios.post(`/api/todos`, newtodo)
      .then(res => {
        this.setState({
          items: this.state.items.concat(newtodo),
          text: ''
       });
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }
  
  class TodoList extends React.Component {
    render() {
      return (
        <ul>
          {this.props.items.map(item => (
            <li>{item.text}</li>
          ))}
        </ul>
      );
    }
  }
  
  ReactDOM.render(<TodoApp />, document.getElementById('root'));
  
  