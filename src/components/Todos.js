import React from 'react';

export default class Todos extends React.Component {

  state = {
    error: undefined
  };

  handleEditTodo = (e) => {
    const title = e.target.textContent;
    const newTitle = prompt('Please enter the new title: ')
    const error = this.props.handleEditTodo(title, newTitle);
    this.setState(() => ({ error }));
  };

  render() {
    return (
      <div className='todos'>
        <h3>{`You have ${this.props.todos.length} ${this.props.todos.length === 1 ? 'todo' : 'todos'} remaining`}</h3>
        {this.state.error && <p className='todos__error-message'>{this.state.error}</p>}
        {
          this.props.todos.map((todo, index) => {
            return (
              <React.Fragment key={index}>
                <b><p onClick={this.handleEditTodo} className='todos__title'>{todo.title}</p></b>
                <p className='todos__description'>{todo.description}</p>
                <p className='todos__dueDate'>Due by: {todo.dueDate ? todo.dueDate : "N/A"}</p>
                <button
                  onClick={(e) => {
                    this.props.handleCompleteTodo(todo.title)
                  }}
                >
                  Complete
                  </button>
              </React.Fragment>
            )
          })
        }
      </div>
    );
  };
}