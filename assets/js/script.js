// Retrieve tasks and nextId from localStorage
//let taskList = JSON.parse(localStorage.getItem("tasks"));
//let nextId = JSON.parse(localStorage.getItem("nextId"));

// page elements
submitTaskEl = $("#task-form");
addTaskTitleInputEl = $("#task-title-input");
addTaskDateInputEl = $("#task-date-input");
addTaskDescInputEl = $("#task-desc-input");

toDoCardsEl = $("#todo-cards");
inProgessCardsEl = $("#in-progress-cards");
doneCardsEl = $("done-cards");

taskCard = $("#task-card");
deleteBtn = $("#delete-btn");

// task object    
var newTaskRecord = {
    taskId: undefined,
    title: undefined,
    date: undefined,
    description: undefined,
};

// Todo: create a function to generate a unique task id
// return a epoch time with stb appended to front
function generateTaskId() {
    var unix = dayjs().unix();
    return "stb_" + unix;

}

// Todo: create a function to create a task card
function createTaskCard(task) {

  // get todays date
  let today = dayjs().startOf('day');
  
  let cardEl = $('<div id=task class="task-card card mb-2" draggable="true" ondragstart="drag(event)" data-index="' + task.taskId +'">');
  //let cardEl = $('<div id=task class="task-card card mb-2" data-index="' + task.taskId +'">');
  let divEl = $('<div>');
  
  
  let cardHeaderDivEl = $('<div class="card-header">');
  let cardHeaderEl = $('<h5>');
  cardHeaderEl.text(task.title);

  cardHeaderDivEl.append(cardHeaderEl);

  let descEl = $('<p class="card-text">').text(task.description);

  let taskDate = dayjs(task.date);

  let formatedDueDate = taskDate.format('MM/DD/YYYY');
  let dueDateEl = $('<p class="card-text">').text(formatedDueDate);

  let deleteEl = $('<button id="delete-btn" class="mb-3 btn-delete-task">Delete</button>');
    
  //check for late submission
  if (taskDate.isBefore(today)) {
    cardEl.addClass('task-late');
    console.log("task is late");
  } else if (taskDate.isSame(today)) {
    cardEl.addClass('task-due-today');
    console.log("task is due today");
  } 

  // append all elements
  divEl.append(cardHeaderDivEl, descEl, dueDateEl, deleteEl);
  cardEl.append(divEl);
  toDoCardsEl.append(cardEl);

  // store in local storage \
  //console.log("InnerHTML of to do list: " + toDoCardsEl.html());
  //localStorage.setItem('toDoCardsEl', toDoCardsEl.html());
  //renderTaskList();

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  // console.log("renderTaskList");

  // $(".task-card").draggable({
  //     revert: true,
  //     cursor: "move"
  // });


  // $(".task-card").droppable({
  //     accept: ".task-card",
  //     drop: function (event, ui) {
  //       handleDrop(event, ui);
  //     }
  // });

  // $('.card-body').each(function () {
  //     var dataIndex = $(this).attr('data-index');
  //     var itemIndex = localStorage.getItem(dataIndex);
  //     if (itemIndex) {
  //       $('.draggable[data-index="' + intemIndex + '"]').detach().appendTo(this);
  //     }
  // })

}

// Todo: create a function to handle adding a new task
// add new task to local storage and to the in progess list
function handleAddTask(event) {
    event.preventDefault();

    var data = Object.create(newTaskRecord);

    // read data from form
    var taskTitle = addTaskTitleInputEl.val().trim();
    var taskDate = addTaskDateInputEl.val();
    var taskDesc = addTaskDescInputEl.val().trim();

    data.taskId = generateTaskId();
    data.title = taskTitle;
    data.date = taskDate;
    data.description = taskDesc

    // add task to local storage
    var tasksLS = readTasksFromStorage();
    tasksLS.push(data);
    saveTasksToStorage(tasksLS);

    // print task to to do list
    printTasksData();

    // clear form
    addTaskTitleInputEl.val('');
    addTaskDateInputEl.val('');
    addTaskDescInputEl.val('');

}

// Gets project data from local storage and displays it
function printTasksData() {

    // clear current projects on the page
    toDoCardsEl.innerHTML = '';
  
    // get projects from localStorage
    var tasks = readTasksFromStorage();
  
    // loop through each project and create a row
    var cnt = 1;
    tasks.forEach(data => {
      createTaskCard(data, cnt);
      cnt++;
    })
   
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

  event.preventDefault();

  console.log(event);

  var taskCardIndex = parseInt($(this).attr('data-index'));
  console.log(taskCardIndex);
  var tasks = readTasksFromStorage();
  tasks.splice(taskCardIndex, 1);

  saveTasksToStorage(tasks);

  printTasksData();


}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  console.log(event);
  console.log(ui);

}

// Reads projects from local storage and returns array of tasks objects.
// Returns an empty array ([]) if there aren't any tasks.
function readTasksFromStorage() {
    var tasks = localStorage.getItem('tasks');
    if (tasks) {
      tasks = JSON.parse(tasks);
    } else {
      tasks = [];
    }
    return tasks;
}

// Takes an array of tasks and saves them in localStorage.
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  // $(".task-card").draggable();
  // $(".task-card").droppable({
  //     drop: function (event, ui) {
  //       handleDrop(event, ui);
  //     }
  // });

  // $('.task-card').each(function () {
  //     var dataIndex = $(this).attr('data-index');
  //     var itemIndex = localStorage.getItem(dataIndex);
  //     if (itemIndex) {
  //       $('.draggable[data-index="' + intemIndex + '"]').detach().appendTo(this);
  //     }
  // })
  

  //$("#task-card").on('click', '.btn-delete-task', handleDeleteTask);
  //$("todo-cards").on('click', '.btn-delete-task', handleDeleteTask);

  // document.getElementById('task-card').addEventListener('click', function(event) {
  //   console.log("inside task card to delete card");
  
  //   event.stopPropagaion();
  
  // })

  // prevent refresh 
  // window.addEventListener("beforeunload", function(event) {
  //   // Cancel the event to prevent the page from refreshing
  //   event.preventDefault();
  //   // Chrome requires returnValue to be set
  //   event.returnValue = '';

  // });


});



 function allowDrop(event) {
  event.preventDefault();
  console.log("allow drop called");
}

 function drag(event) {


  // event.dataTransfer.setData("text", event.target.id);
  // console.log("drag: " + event.target.id);

  event.dataTransfer.setData("text", event.target.parentNode);

}

function drop(event) {

  event.preventDefault();

  storeLists();
  // var data = event.dataTransfer.getData("text");
  // console.log("data: " + data);
  // var draggedElement = document.getElementById(data);
  // console.log("dragged Element: " + draggedElement);
  // console.log("target: " + event.target);
  // event.target.appendChild(draggedElement);


  // event.preventDefault();
  // var data = event.dataTransfer.getData("text");
  // console.log("data: " + data);

  // //var draggedElement = $("#task");
  // var draggedElement = document.getElementById(data);
  // console.log(draggedElement);
  // var id = document.getElementById("id");
  // // var draggedElementId = getElementById("id");

  // console.log("id: " + id);
  // console.log(draggedElementId);



  // console.log("draggedElement: " + draggedElement);

  // console.log("target: " + event.target);
  // event.target.appendChild(draggedElement);

}

// not working
//taskCard.on('click', '.btn-delete-task', handleDeleteTask);
//deleteBtn.on('click', '.btn-delete-task', handleDeleteTask);

// try add event listener - error taskCard.addEventListener is not a function
// taskCard.addEventListener('click', function(event) {
//   console.log("inside task card");

//   event.stopPropagaion();
// });

// document.getElementById('task-card').addEventListener('click', function(event) {
//   console.log("inside task card");

//   event.stopPropagaion();

// })




submitTaskEl.on('submit', handleAddTask);

