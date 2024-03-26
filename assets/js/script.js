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

// return a epoch time with stb appended to front
function generateTaskId() {
    var unix = dayjs().unix();
    return "stb_" + unix;

}

// Todo: create a function to create a task card
function createTaskCard(task, lane) {

  // get todays date
  let today = dayjs().startOf('day');
  
  if (task === null) {
    console.log("task is null");
    return;
  }
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
    
  //check for late submission
  if (taskDate.isBefore(today)) {
    cardEl.addClass('task-late');
  } else if (taskDate.isSame(today)) {
    cardEl.addClass('task-due-today');
  } 

  // append all elements
  divEl.append(cardHeaderDivEl, descEl, dueDateEl, deleteEl);
  cardEl.append(divEl);

  // append the card to the appropriate lane
  // remove the task due or late from the card if task is done
  if (lane == "todo-cards") {
    toDoCardsEl.append(cardEl);
  } else if (lane === "in-progress-cards") {
    inProgessCardsEl.append(cardEl);
  } else if (lane === "done-cards") {
    if (cardEl.hasClass('task-due-today')) 
      cardEl.removeClass('task-due-today');
  
    if (cardEl.hasClass('task-late')) 
      cardEl.removeClass('task-late');
    doneCardsEl.append(cardEl);
  }

}

// handle adding a new task
// add new task to local storage and to the to do list
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
// in the correct lane
function printTasksData(lsKey) {

    // clear current projects on the page
    if (lsKey === "todo-cards") {
      toDoCardsEl.empty();
  
      // get projects from localStorage
      var tasks = readTasksFromStorage(lsKey);
  
      if (tasks !== null) {
        // loop through each project and create a row
        tasks.forEach(data => {
          if (data !== null) {
            createTaskCard(data, lsKey);
          }
        })
      }
    } else if (lsKey === "in-progress-cards") {
      inProgessCardsEl.empty();

      var tasks = readTasksFromStorage(lsKey);
  
      if (tasks !== null) {
        // loop through each project and create a row
        tasks.forEach(data => {
          if (data !== null) {
            createTaskCard(data, lsKey);
          }
        })
      }
    } else if (lsKey === "done-cards") {
      doneCardsEl.empty();
      
      var tasks = readTasksFromStorage(lsKey);

      if (tasks !== null) {
        // loop through each project and create a row
        tasks.forEach(data => {
          if (data !== null) {
            createTaskCard(data, lsKey);
          }
        })
      }      

    }
   
}

// delete task form lane
function handleDeleteTask(event) {

  event.preventDefault();

  var lsKey = $(event.target.parentNode.parentNode.parentNode).attr('id');
  var taskCardIndex = $(this).attr('data-index');

  var tasks = readTasksFromStorage(lsKey);
  for (let x = 0; x < tasks.length; x++) {
    if (tasks[x].taskId === taskCardIndex) {
      tasks.splice(tasks[x], 1);
    }
  }

  saveTasksToStorage(lsKey, tasks);
  printTasksData(lsKey);

}

// handles drop event for all lanes 
// this function needs some refactoring but passed to get assignment turned in 
function handleDrop(event, ui, droppableId) {

  var dragableElement = ui.draggable;
  var draggableId = dragableElement.attr("data-index");

  // Check if the dropped element is being moved to the in-progress lane
  var toTasksLs = readTasksFromStorage("todo-cards");
  var inProgressTasksLs = readTasksFromStorage("in-progress-cards");
  var doneTasksLs = readTasksFromStorage("done-cards");

  //find which array the index is from
  var fnd = '';
  for (let x = 0; x < toTasksLs.length; x++) {
    if (toTasksLs[x].taskId === draggableId) {
      var moveThisRow = toTasksLs[x];
      toTasksLs.splice(toTasksLs[x], 1);      
      fnd = 'todoArr';
      break;
    }
  }
  toTasksLs = toTasksLs.filter(data => data !== null);


  for (let x = 0; x < inProgressTasksLs.length; x++) {
    if (inProgressTasksLs[x].taskId === draggableId) {
      var moveThisRow = inProgressTasksLs[x];
      inProgressTasksLs.splice(inProgressTasksLs[x], 1);
      fnd = 'inProgressArr';
      break;
    }
  }
  inProgressTasksLs = inProgressTasksLs.filter(data => data !== null);


  for (let x = 0; x < doneTasksLs.length; x++) {
    if (doneTasksLs[x].taskId === draggableId) {
      var moveThisRow = doneTasksLs[x];
      doneTasksLs.splice(doneTasksLs[x], 1);
      fnd = 'doneArr';
      break;
    }
  }
  doneTasksLs = doneTasksLs.filter(data => data !== null);

  if (droppableId === "to-do") {
    toTasksLs.push(moveThisRow);
  } else if (droppableId === "done") {
    doneTasksLs.push(moveThisRow);
  } else if (droppableId === "in-progress") {
    inProgressTasksLs.push(moveThisRow);
  }

  saveTasksToStorage("todo-cards", toTasksLs);
  printTasksData("todo-cards");

  saveTasksToStorage("in-progress-cards", inProgressTasksLs);
  printTasksData("in-progress-cards");

  saveTasksToStorage("done-cards", doneTasksLs);
  printTasksData("done-cards");

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

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  $('.task-card').draggable();

  $('#to-do').droppable({
    drop: function (event, ui) {
      var droppableId = $(this).attr("id");
      handleDrop(event, ui, droppableId);
    }
  });  
  $('#in-progress').droppable({
    drop: function (event, ui) {
       var droppableId = $(this).attr("id");
       handleDrop(event, ui, droppableId);
     }
   });

  $('#done').droppable({
    drop: function (event, ui) {
      var droppableId = $(this).attr("id");
      handleDrop(event, ui, droppableId);
    }
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
    
});

submitTaskEl.on('submit', handleAddTask);

// load data from ls when page is displayed
printTasksData("todo-cards");
printTasksData("in-progress-cards");
printTasksData("done-cards");
