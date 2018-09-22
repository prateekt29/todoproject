import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import './index.css';


class TodoApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { items: [], text: '' , todoid: 13};
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
        "title": "new-todo"
      };
      const newtodoitem = {
        "complete":false,
        "content": this.state.text
      };

      console.log(newtodoitem)
      // axios.post(`/api/todos`, newtodo)
      // .then(res => {
      //   this.setState({ todoid: res.data.id });
      //   console.log(res.data.id)
      // })
      // .catch(function (error) {
      //   console.log(error);
      // })

      axios.post('/api/todos/' + this.state.todoid + '/items', newtodoitem)
      .then(res => {
        newtodoitem["id"] = res.data.id
        console.log(newtodoitem)
        this.setState({
          items: this.state.items.concat(newtodoitem),
          text: ''
       });
      })
      .catch(function (error) {
        console.log(error);
      })
    }
  }
  
  class TodoList extends React.Component {
    done(e) {
      e.preventDefault();
      console.log("Task is done")
    }
    render() {
      return (
        <ul>
          {this.props.items.map(item => (
            <li>{item.content}<a href="" onClick={this.done.bind(this)}>✓</a></li>
          ))}
        </ul>
      );
    }
  }
  
  ReactDOM.render(<TodoApp />, document.getElementById('root'));
  
  