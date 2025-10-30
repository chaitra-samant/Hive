import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import "./KanbanBoard.css";
import backgroundImage from "./wp1.webp";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [newTask, setNewTask] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [calendarDays, setCalendarDays] = useState([]);

  // Function to generate the calendar days
  const generateCalendarDays = (tasks) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let day = 1; day <= lastDate; day++) {
      const dayString = `${currentYear}-${currentMonth + 1}-${day}`;
      const highlighted = tasks.some((task) => task.deadline === dayString);
      days.push({
        day,
        highlighted,
        tasksDue: tasks.filter((task) => task.deadline === dayString),
      });
    }
    return days;
  };

  // Fetch tasks from the backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((response) => {
        const tasks = response.data;
        const groupedTasks = {
          todo: tasks.filter((task) => task.column === "todo"),
          inProgress: tasks.filter((task) => task.column === "inProgress"),
          done: tasks.filter((task) => task.column === "done"),
        };
        setTasks(groupedTasks);

        // Generate the calendar days
        setCalendarDays(generateCalendarDays(tasks));
      })
      .catch((error) => {
        console.error("There was an error fetching tasks:", error);
      });
  }, []);

  // Function to add a new task
  const handleAddTask = () => {
    if (newTask.trim() === "") return;

    const newTaskObj = {
      task: newTask,
      deadline: newTaskDeadline,
      column: "todo",
      color: "blue", // Set default color to blue
    };

    axios
      .post("http://localhost:5000/api/tasks", newTaskObj)
      .then((response) => {
        const addedTask = response.data;
        setTasks((prevTasks) => {
          const updatedTasks = {
            ...prevTasks,
            todo: [...prevTasks.todo, addedTask],
          };
          setCalendarDays(generateCalendarDays(updatedTasks.todo));
          return updatedTasks;
        });
        setNewTask("");
        setNewTaskDeadline("");
      })
      .catch((error) => {
        console.error("There was an error adding the task:", error);
      });
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const sourceItems = [...sourceColumn];
    const destItems = [...destColumn];

    const [movedItem] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, movedItem);

    const updatedTasks = {
      ...tasks,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    };
    setTasks(updatedTasks);

    // Update task in the backend
    axios
      .put(`http://localhost:5000/api/tasks/${movedItem._id}`, {
        column: destination.droppableId,
      })
      .then(() => {
        // Update the calendar immediately after dragging a task
        setCalendarDays(
          generateCalendarDays(
            updatedTasks.todo.concat(updatedTasks.inProgress, updatedTasks.done)
          )
        );
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  // Function to delete a task
  const handleDeleteTask = (taskId, column) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${taskId}`)
      .then(() => {
        const updatedColumn = tasks[column].filter(
          (task) => task._id !== taskId
        );
        setTasks((prevTasks) => {
          const updatedTasks = {
            ...prevTasks,
            [column]: updatedColumn,
          };
          setCalendarDays(
            generateCalendarDays(
              updatedTasks.todo.concat(
                updatedTasks.inProgress,
                updatedTasks.done
              )
            )
          );
          return updatedTasks;
        });
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const renderColumn = (title, key) => (
    <Droppable droppableId={key}>
      {(provided) => (
        <div
          className="kanban-column"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h3>{title}</h3>
          <div className="kanban-tasks">
            {tasks[key].map((taskObj, index) => (
              <Draggable
                key={taskObj._id}
                draggableId={taskObj._id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={`kanban-task ${taskObj.color}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <span>{taskObj.task}</span>
                    <button
                      className="delete-task"
                      onClick={() => handleDeleteTask(taskObj._id, key)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );

  const renderCalendar = () => {
    return (
      <div className="calendar-grid">
        {calendarDays.map((day) => (
          <div
            key={day.day}
            className={`calendar-day ${day.highlighted ? "highlighted" : ""}`}
          >
            <span>{day.day}</span>
            {day.tasksDue.length > 0 && (
              <div className="task-list">
                {day.tasksDue.map((task) => (
                  <div key={task._id} className="task-due">
                    <span>{task.task}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="kanban-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div className="kanban-body">
          <div className="kanban-left">
            <div className="todo-card">
              <h2>Add Task</h2>
              <div className="new-task">
                <input
                  type="text"
                  placeholder="Enter a new task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <input
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                />
                <button className="cssbuttons-io" onClick={handleAddTask}>
                  <span>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h24v24H0z" fill="none"></path>
                    </svg>
                    <b>Add Task +</b>
                  </span>
                </button>
              </div>

              <div className="kanban-columns">
                {renderColumn("To Do", "todo")}
                {renderColumn("In Progress", "inProgress")}
                {renderColumn("Done", "done")}
              </div>
            </div>
          </div>

          <div className="kanban-right">
            <div className="calendar-card">
              <h2>Calendar - Dec 2024</h2>
              {renderCalendar()}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
