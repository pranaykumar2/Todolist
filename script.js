document.addEventListener("DOMContentLoaded", function() {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");

    let todoCount = 0; // Initialize todoCount

    // Function to add a new todo item
    async function addTodoItem(todoContent) {
        // Increment todoCount
        todoCount++;

        // Create a new list item
        const todoItem = document.createElement("li");

        // Create a span element for the todo content
        const todoContentSpan = document.createElement("span");
        todoContentSpan.textContent = todoContent;

        // Create a span element for the completion time
        const completionTimeSpan = document.createElement("span");
        completionTimeSpan.style.display = "none"; // Hide by default

        // Add a delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Update";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", async function() {
            // Call the toggleCompleted function of the smart contract
            await todoContract.methods.toggleCompleted(todoItem.dataset.id).send({from: accounts[0]});
            // Add strike-through style to the todo item content
            todoContentSpan.style.textDecoration = "line-through";
            // Hide the delete button
            deleteButton.style.display = "none";
            // Record the time when the task is marked as completed
            const currentTime = new Date().toLocaleString();
            // Display the completion time
            completionTimeSpan.textContent = `    Completed at ${currentTime}`;
            completionTimeSpan.style.display = "inline"; // Show completion time
        });

        // Append the todo content span and delete button to the list item
        todoItem.appendChild(todoContentSpan);
        todoItem.appendChild(deleteButton);
        todoItem.appendChild(completionTimeSpan); // Append the completion time span

        // Append the list item to the todo list
        todoList.appendChild(todoItem);

        // Add the todo item ID to the dataset
        todoItem.dataset.id = todoCount;
    }

    // Event listener for submitting the todo form
    todoForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const todoContent = todoInput.value.trim();
        if (todoContent !== "") {
            // Call the addTodo function of the smart contract
            await todoContract.methods.addTodo(todoContent).send({from: accounts[0]});
            // Update the UI with the new todo item
            addTodoItem(todoContent);
            todoInput.value = "";
        }
    });
});

// Function to load existing todo items from the smart contract
async function loadTodoItems() {
    // Fetch the total number of todo items from the smart contract
    const todoCount = await todoContract.methods.todoCount().call();
    // Fetch each todo item from the smart contract and add it to the UI
    for (let i = 1; i <= todoCount; i++) {
        const todo = await todoContract.methods.todos(i).call();
        if (!todo.completed) {
            addTodoItem(todo.content);
        }
    }
}

// Load todo items when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", async function() {
    // Check if Web3 is injected by MetaMask or another provider
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        try {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Load accounts
            accounts = await web3.eth.getAccounts();
            // Load existing todo items
            await loadTodoItems();
        } catch (error) {
            // Handle user denial of account access
            console.error("User denied account access");
        }

        // Listen for 'disconnect' event instead of 'close'
        window.ethereum.on('disconnect', () => {
            console.log('MetaMask disconnected');
        });
    } else {
        console.log('No Ethereum provider detected');
    }
});
