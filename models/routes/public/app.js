const apiUrl = 'http://localhost:5000/api';

const register = async () => {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  try {
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    alert(data.message || 'Registered successfully');
  } catch (error) {
    alert('Registration failed');
  }
};

const login = async () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      document.getElementById('auth').style.display = 'none';
      document.getElementById('tasks').style.display = 'block';
      getTasks();
    } else {
      alert('Login failed');
    }
  } catch (error) {
    alert('Login failed');
  }
};

const getTasks = async () => {
  try {
    const res = await fetch(`${apiUrl}/tasks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const tasks = await res.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.innerText = task.title;
      li.classList.toggle('completed', task.completed);
      li.onclick = () => toggleTask(task._id, !task.completed);
      const delButton = document.createElement('button');
      delButton.innerText = 'Delete';
      delButton.onclick = (e) => {
        e.stopPropagation();
        deleteTask(task._id);
      };
      li.appendChild(delButton);
      taskList.appendChild(li);
    });
  } catch (error) {
    alert('Failed to fetch tasks');
  }
};

const addTask = async () => {
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;

  try {
    await fetch(`${apiUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title, description }),
    });
    getTasks();
  } catch (error) {
    alert('Failed to add task');
  }
};

const toggleTask = async (id, completed) => {
  try {
    await fetch(`${apiUrl}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ completed }),
    });
    getTasks();
  } catch (error) {
    alert('Failed to update task');
  }
};

const deleteTask = async (id) => {
  try {
    await fetch(`${apiUrl}/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    getTasks();
  } catch (error) {
    alert('Failed to delete task');
  }
};
