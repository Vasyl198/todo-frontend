
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './index.css'; // Импорт Tailwind CSS

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null); // ID задачи в режиме редактирования
  const [editText, setEditText] = useState(''); // Текст для редактирования

  // Загрузка задач с бэкенда
  useEffect(() => {
    axios
      .get('https://todo-backend.onrender.com/api/tasks')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  // Добавление задачи
  const addTask = () => {
    if (newTask.trim()) {
      axios
       .post('https://todo-backend.onrender.com/api/tasks', { text: newTask })
        .then((response) => {
          setTasks([...tasks, response.data]);
          setNewTask('');
        })
        .catch((error) => console.error('Error adding task:', error));
    }
  };

  // Удаление задачи
  const deleteTask = (id) => {
    if (!id) {
      console.error('Invalid task ID:', id);
      return;
    }
    axios
      .delete(`https://todo-backend.onrender.com/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  // Отметка задачи как выполненной/невыполненной
  const toggleTask = (id, completed) => {
    if (!id) {
      console.error('Invalid task ID:', id);
      return;
    }
    axios
      .put(`https://todo-backend.onrender.com/api/tasks/${id}`, { completed: !completed })
      .then((response) => {
        setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      })
      .catch((error) => console.error('Error toggling task:', error));
  };

  // Начало редактирования задачи
  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditText(task.text);
  };

  // Сохранение отредактированной задачи
  const saveEdit = (id) => {
    if (!id) {
      console.error('Invalid task ID:', id);
      return;
    }
    if (editText.trim()) {
      axios
        .put(`https://todo-backend.onrender.com/api/tasks/${id}`, { text: editText })
        .then((response) => {
          setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
          setEditingTask(null);
          setEditText('');
        })
        .catch((error) => console.error('Error editing task:', error));
    }
  };

  // Отмена редактирования
  const cancelEdit = () => {
    setEditingTask(null);
    setEditText('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Список задач
        </h1>
        <div className="flex mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Введите задачу"
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <button
            onClick={addTask}
            className="bg-primary text-white p-3 rounded-r-lg hover:bg-blue-700 shadow-md transition-all duration-300"
          >
            Добавить
          </button>
        </div>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md shadow-sm"
            >
              {editingTask === task._id ? (
                <div className="flex flex-1 items-center space-x-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <button
                    onClick={() => saveEdit(task._id)}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-blue-700 shadow-md transition-all duration-300"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500 shadow-md transition-all duration-300"
                  >
                    Отмена
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onDoubleClick={() => startEditing(task)}
                    className={`text-lg flex-1 cursor-pointer ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {task.text}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleTask(task._id, task.completed)}
                      className={`p-2 rounded-lg shadow-md transition-all duration-300 ${
                        task.completed
                          ? 'bg-accent hover:bg-yellow-600'
                          : 'bg-complete hover:bg-green-700'
                      } text-white`}
                    >
                      {task.completed ? 'Отменить' : 'Выполнить'}
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-danger text-white p-2 rounded-lg hover:bg-red-700 shadow-md transition-all duration-300"
                    >
                      Удалить
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
