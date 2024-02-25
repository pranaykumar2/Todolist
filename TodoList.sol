// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    // Struct to represent a todo item
    struct Todo {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Todo) public todos;

    // Event to track todo item creation
    event TodoCreated(uint256 id, string content, bool completed);

    // Counter to keep track of todo item IDs
    uint256 public todoCount;

    constructor() {
        // Initialize todoCount
        todoCount = 0;
    }

    // Function to add a new todo item
    function addTodo(string memory _content) public payable  {
        if(msg.value == 1 ether ) {
        todoCount++;
        todos[todoCount] = Todo(todoCount, _content, false);
        emit TodoCreated(todoCount, _content, false);
        }
    }

    // Function to mark a todo item as completed
    function toggleCompleted(uint256 _id) public {
        Todo storage todo = todos[_id];
        todo.completed = !todo.completed;
    }
}
