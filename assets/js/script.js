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
doneCardsEl = $("#done-cards");

taskCard = $(".task-card");
deleteBtn = $("#delete-btn");
cardBody = $(".card-body");

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
function createTaskCard(task, lane) {

  // get todays date
  let today = dayjs().startOf('day');
  
  //let cardEl = $('<div id=task class="task-card card mb-2" draggable="true" data-index="' + task.taskId +'">');
  let cardEl = $('<div id=task class="task-card card mb-2" data-index="' + task.taskId +'">');
  let divEl = $('<div>');
  
  
  let cardHeaderDivEl = $('<div class="card-header">');
  let cardHeaderEl = $('<h5>');
  cardHeaderEl.text(task.title);

  cardHeaderDivEl.append(cardHeaderEl);

  let descEl = $('<p class="card-text">').text(task.description);

  let taskDate = dayjs(task.date);

  let formatedDueDate = taskDate.format('MM/DD/YYYY');
  let dueDateEl = $('<p class="card-text">').text(formatedDueDate);

  let deleteEl = $('<button/>', {
    text: 'Delete',
    click: handleDeleteTask
  });
  deleteEl.addClass('mb-3 btn-delete-task');
  deleteEl.attr('data-index', task.taskId);
  //let deleteEl = $('<button id="delete-btn" type="submit" class="mb-3 btn-delete-task">Delete</button>');
    
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


  if (lane == "todo-cards") {
    toDoCardsEl.append(cardEl);
  } else if (lane === "in-progress-cards") {
    inProgessCardsEl.append(cardEl);
  } else if (lane === "done-cards") {
    cardEl.removeClass('task-due-today');
    cardEl.removeClass('task-late');
    doneCardsEl.append(cardEl);
  }

  //console.log("InnerHTML of to do list: " + toDoCardsEl.html());


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
    var tasksLS = readTasksFromStorage("todo-cards");
    tasksLS.push(data);
    saveTasksToStorage("todo-cards", tasksLS);

    // print task to to do list
    printTasksData("todo-cards");

    // clear form
    addTaskTitleInputEl.val('');
    addTaskDateInputEl.val('');
    addTaskDescInputEl.val('');

}

// Gets project data from local storage and displays it
function printTasksData(lsKey) {

    // clear current projects on the page
    if (lsKey === "todo-cards") {
      toDoCardsEl.empty();
  
      // get projects from localStorage
      var tasks = readTasksFromStorage(lsKey);
  
      // loop through each project and create a row
      tasks.forEach(data => {
        createTaskCard(data, lsKey);
      })
    } else if (lsKey === "in-progress-cards") {
      inProgessCardsEl.empty();

      var tasks = readTasksFromStorage(lsKey);
  
      // loop through each project and create a row
      tasks.forEach(data => {
        createTaskCard(data, lsKey);
      })
    }
   
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

  event.preventDefault();

  var lsKey = $(event.target.parentNode.parentNode.parentNode).attr('id');
  console.log("ggparent id: " + $(event.target.parentNode.parentNode.parentNode).attr('id'));


  var taskCardIndex = $(this).attr('data-index');
  console.log(taskCardIndex);

  var tasks = readTasksFromStorage(lsKey);
  for (let x = 0; x < tasks.length; x++) {
    if (tasks[x].taskId === taskCardIndex) {
      tasks.splice(tasks[x], 1);
    }
  }

  saveTasksToStorage(lsKey, tasks);
  printTasksData(lsKey);

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  event.preventDefault();

  //console.log(event);
  //console.log(ui);

}

// Reads projects from local storage and returns array of tasks objects.
// Returns an empty array ([]) if there aren't any tasks.
function readTasksFromStorage(lsKey) {
    var tasks = localStorage.getItem(lsKey);
    if (tasks) {
      tasks = JSON.parse(tasks);
    } else {
      tasks = [];
    }
    return tasks;
}

// Takes an array of tasks and saves them in localStorage.
function saveTasksToStorage(lsKey, tasks) {
    localStorage.setItem(lsKey, JSON.stringify(tasks));
}

function storeLists() {

  // store in local storage 
  console.log("InnerHTML of to do list: " + toDoCardsEl.html());
  localStorage.setItem('toDoCardsEl', toDoCardsEl.html());

  console.log("InnerHTML of in progress list: " + inProgessCardsEl.html());
  localStorage.setItem('inProgressCardsEl', inProgessCardsEl.html());

  console.log("InnerHTML of done list: " + doneCardsEl.html());
  localStorage.setItem('doneCardsEl', doneCardsEl.html());
  
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  $('.task-card').draggable();

  $('#in-progress').droppable({
    drop: function (event, ui) {

      var dragableElement = ui.draggable;
      var draggableId = dragableElement.attr("data-index");
      console.log("data index: " + draggableId);
      var droppableId = $(this).attr("id");

      // Check if the dropped element is being moved to the in-progress lane
      var toTasksLs = readTasksFromStorage("todo-cards");
      var inProgressTasksLs = readTasksFromStorage("in-progress-cards");
      var doneTasksLs = readTasksFromStorage("done-cards");

      if (droppableId === "in-progress") {
        // find item in todo array
        for (let x = 0; x < toTasksLs.length; x++) {
          if (toTasksLs[x].taskId === draggableId) {
            var moveThisRow = toTasksLs[x];
            toTasksLs.splice(toTasksLs[x], 1);
          }
        }

        inProgressTasksLs.push(moveThisRow);

        // add task to local storage
        saveTasksToStorage("todo-cards", toTasksLs);
        saveTasksToStorage("in-progress-cards", inProgressTasksLs);
        
        printTasksData("todo-cards");        
        printTasksData("in-progress-cards"); 

      }

      // console.log("id: " + $(this).attr("id"));
      console.log("parent: " + $(this).parent());

    }

  });

});

$('.card-body').sortable({
  placeholder: "ui-state-highlight"
});

$('#todo-cards').sortable({
  placeholder: "ui-state-highlight"
});

$('#in-progress-cards').sortable({
  placeholder: "ui-state-highlight"
});

$('#done-cards').sortable({
  placeholder: "ui-state-highlight"
});


submitTaskEl.on('submit', handleAddTask);

printTasksData("todo-cards");
printTasksData("in-progress-cards");
printTasksData("done-cards");
