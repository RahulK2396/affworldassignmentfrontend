import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'; 


const Task = ({ task, onDelete, onDragStart, onDragEnd }) => {
  return (
    <div
      className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 cursor-pointer"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
    >
      <div className="flex justify-between items-center">
        <span>{task.name}</span>
        <button
          className="text-red-500"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this task?")) {
              onDelete(task._id); 
            }
          }}
        >
          ❌
        </button>
      </div>
      <p>{task.description}</p>
    </div>
  );
};


const TaskList = ({
  tasks,
  status,
  onDragOver,
  onDrop,
  onDelete,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div
      className="flex-1 p-4 bg-gray-100 rounded-lg shadow-md overflow-y-auto"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <h2 className="text-xl font-semibold mb-4">{status}</h2>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task
            key={task._id} 
            task={task}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
    </div>
  );
};


const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [userId, setUserId] = useState("");

 
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        return;
      }
      try {
        const decoded = jwtDecode(token);

      
        const userIdFromToken = decoded.id;
        setUserId(userIdFromToken);

       
        const response = await axios.get(`https://affworld-assignment-backend-5zi9dckj5-rahuls-projects-3a4f49cc.vercel.app/api/tasks?userId=${userIdFromToken}`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (taskName && taskDescription) {
      const newTask = {
        name: taskName,
        description: taskDescription,
        status: "Pending",
        userId: userId,
      };

      try {
        const response = await axios.post("https://affworld-assignment-backend-seven.vercel.app/api/tasks", newTask);
        setTasks([...tasks, response.data]); 
      } catch (error) {
        console.error("Error adding task:", error);
      }

      setTaskName("");
      setTaskDescription("");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`https://affworld-assignment-backend-seven.vercel.app/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id)); 
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    if (draggedTask) {
      const updatedTask = { ...draggedTask, status };
      try {
        await axios.put(`https://affworld-assignment-backend-seven.vercel.app/api/tasks/${draggedTask._id}`, updatedTask); 
        setTasks(tasks.map((task) =>
          task._id === draggedTask._id ? updatedTask : task 
        ));
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/login"; 
  };

  return (
    <div className="min-h-screen flex flex-col">
     
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <nav className="flex space-x-4">
            <button
              onClick={() => window.location.href = "/feed"}
              className="hover:underline text-sm sm:text-base"
            >
              Feed
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded-lg text-sm sm:text-base"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

   
      <main className="flex flex-col lg:flex-row flex-1 p-6">
        <div className="lg:w-1/3 mb-6 lg:mb-0">
          <form
            className="mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
          >
            <input
              type="text"
              className="border p-2 mb-2 w-full rounded-md"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <input
              type="text"
              className="border p-2 mb-2 w-full rounded-md"
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white w-full p-2 rounded-lg"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Task Lists */}
        <div className="flex-1 flex space-x-4">
          <TaskList
            tasks={tasks}
            status="Pending"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDeleteTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
          <TaskList
            tasks={tasks}
            status="Completed"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDeleteTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
          <TaskList
            tasks={tasks}
            status="Done"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDeleteTask}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>
      </main>
    </div>
  );
};

export default TaskManager;
