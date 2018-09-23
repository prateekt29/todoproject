import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import './index.css';


class TodoApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { items: [], text: '' , todoid: 20};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    render() {
      return (
        <div>
          <h3>TODO</h3>
          <TodoList items={this.state.items} complete={this.completeTodo.bind(this)}/>
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

    completeTodo(todo) {
      const todos = this.state.items
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === todo.id) {
          todos[i].complete = true;
          break;
        }
      }
      this.setState({
        items: todos
     });

     axios.put('/api/todos/' + this.state.todoid + '/items/' + todo.id, {complete : true})
      .then(res => {
        console.log(res.status)
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
            <Todo todo={item} complete={this.props.complete}/>
          ))}
        </ul>
      );
    }
  }

  class Todo extends React.Component {
    done(e) {
      e.preventDefault();
      this.props.complete(this.props.todo);
    }

    render() {
        let todo = this.props.todo;
        if (todo.complete) {
            return (
                <li>
                    <del>{todo.content}</del> <a href="" onClick={this.done.bind(this)}>✓</a>
                </li>
            );
        } else {
            return (
                <li>
                    {todo.content} <a href="" onClick={this.done.bind(this)}>✓</a>
                </li>
            );
        }
    }
}
  
  ReactDOM.render(<TodoApp />, document.getElementById('root'));
  
  