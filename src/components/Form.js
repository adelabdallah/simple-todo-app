import React from 'react';

export default class Form extends React.Component {

  state = {
    error: undefined
  };

  handleAddTodo = (e) => {
    e.preventDefault();

    const todo = {
      title: e.target.elements.addTitle.value.trim(),
      description: e.target.elements.addDesc.value.trim(),
      dueDate: e.target.elements.addDate.value.trim(),
      isCompleted: false,
    };

    const error = this.props.handleAddTodo(todo);

    this.setState(() => {
      return { error };
    });

    e.target.elements.addTitle.value = '';
    e.target.elements.addDesc.value = '';
    e.target.elements.addDate.value = '';
  };

  render() {
    return (
      <div>
        {this.state.error && <p className='creation-error-message'>{this.state.error}</p>}
        <form className='form' onSubmit={this.handleAddTodo}>
          <input type='text' placeholder='Title' name='addTitle' />
          <input type='text' placeholder='Description' name='addDesc' />
          <input type='date' name='addDate' />
          <button>Add Todo</button>
        </form>
      </div>
    )
  }

}
