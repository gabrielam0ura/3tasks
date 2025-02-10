import React, { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./Api";
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [photoURL, setPhotoURL] = useState("/img/sua-foto.png");
    const [userName, setUserName] = useState("Seu Nome");
    const [isEditingName, setIsEditingName] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);
    const modeImage = isLightMode ? '/img/Mode.svg' : '/img/Mode.svg';

    useEffect(() => {
        const savedPhotoURL = localStorage.getItem('photoURL');
        const savedUserName = localStorage.getItem('userName');
        if (savedPhotoURL) {
            setPhotoURL(savedPhotoURL);
        }
        if (savedUserName) {
            setUserName(savedUserName);
        }
        getTasks().then((res) => setTasks(res.data));
    }, []);

    const toggleLightMode = () => {
        document.body.classList.toggle("light-mode");
        setIsLightMode(prevMode => !prevMode);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoURL(reader.result);
                localStorage.setItem('photoURL', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTask = () => {
        if (title.length >= 3 && title.length <= 50) {
            createTask(title).then(() => {
                setTitle("");
                getTasks().then((res) => setTasks(res.data));
            });
        } else {
            alert("O título da tarefa deve ter entre 3 e 50 caracteres.");
        }
    };

    const editTask = (id) => {
        if (!editedTitle.trim()) {
            alert("Edite o nome da task!");
            return;
        }

        updateTask(id, editedTitle).then(() => {
            setEditingId(null);
            setEditedTitle("");
            getTasks().then((res) => setTasks(res.data));
        }).catch(error => {
            console.error("Erro ao editar a tarefa:", error);
        });
    };

    const removeTask = (id) => {
        deleteTask(id).then(() => {
            getTasks().then((res) => setTasks(res.data));
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    const handleNameChange = (e) => {
        setUserName(e.target.value);
    };

    const saveUserName = () => {
        if (userName.trim().length >= 3 && userName.trim().length <= 50) {
            localStorage.setItem('userName', userName.trim());
        } else {
            alert("O nome de usuário deve ter entre 3 e 50 caracteres.");
        }
    };

    const handleKeyPressName = (e) => {
        if (e.key === 'Enter') {
            saveUserName();
            setIsEditingName(false);
        }
    };

    return (
        <div className="container">
            <nav>
                <div className="user-info">
                    <input
                        type="file"
                        className="file-input"
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="fileInput"
                    />
                    <label htmlFor="fileInput">
                        <img
                            className="user-photo"
                            src={photoURL}
                            alt="Sua foto"
                        />
                    </label>
                    <span className="user-name">
                        {isEditingName ? (
                            <input
                                type="text"
                                value={userName}
                                onChange={handleNameChange}
                                onBlur={saveUserName}
                                onKeyPress={handleKeyPressName}
                                autoFocus
                                style={{
                                    backgroundColor: '#000',
                                    color: '#F1F1F1',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                }}
                            />
                        ) : (
                            <span onClick={() => setIsEditingName(true)}>{userName}</span>
                        )}
                    </span>
                </div>
                <img className="logo" src="/img/3tasks.svg" alt="3tasks Logo" />
            </nav>
            <button className="mode-toggle" onClick={toggleLightMode} style={{ backgroundColor: "#000" }}>
                <img src={modeImage} alt="Toggle mode" />
            </button>
            <div className="containerLista">
                <div className="criar">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="New task"
                        onKeyPress={handleKeyPress}
                    />
                    <button className="add" onClick={addTask}>
                        <img src="/img/Duplicate.svg" alt="Add" />
                    </button>
                </div>
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            {editingId === task.id ? (
                                <div className="editar">
                                    <input
                                        value={editedTitle || task.title}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                    />
                                    <button className="edit" onClick={() => editTask(task.id)}>
                                        <img src="/img/Save.svg" alt="Save" />
                                    </button>
                                </div>
                            ) : (
                                <div className="acoes">
                                    <span>{task.title}</span>
                                    <div className="acoes-buttons">
                                        <button className="edit" onClick={() => {
                                            setEditingId(task.id);
                                            setEditedTitle(task.title);
                                        }}>
                                            <img src="/img/Pencil.svg" alt="Edit" />
                                        </button>
                                        <button className="delete" onClick={() => removeTask(task.id)}>
                                            <img src="/img/Delete.svg" alt="Delete" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
