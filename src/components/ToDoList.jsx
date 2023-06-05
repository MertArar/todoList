import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTodoList,
  addTodo,
  updateTodo,
  sortTodo,
  toggleCompleted,
} from "../store/Slice";
import { TiPencil } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";
import empty from "../assets/empty.jpeg";
function TodoList() {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todo.todoList);
  const sortCriteria = useSelector((state) => state.todo.sortCriteria);
  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (todoList.length > 0) {
      localStorage.setItem("todoList", JSON.stringify(todoList));
    }
  }, [todoList]);
  useEffect(() => {
    const localTodoList = JSON.parse(localStorage.getItem("todoList"));
    if (localTodoList) {
      dispatch(setTodoList(localTodoList));
    }
  }, []);

  const handleAddTodo = (task) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(addTodo({ task: task, id: Date.now() }));
      setNewTask("");
      setShowModal(true);
    }
  };
  const handleUpdateToDoList = (id, task) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(updateTodo({ task: task, id: id }));
      setShowModal(false);
    }
  };
  const handleDeleteToDo = (id) => {
    const updatedToDoList = todoList.filter((todo) => todo.id != id);
    dispatch(setTodoList(updatedToDoList));
    localStorage.setItem("todoList", JSON.stringify(updatedToDoList));
  };

  function handleSort(sortCriteria) {
    dispatch(sortTodo(sortCriteria));
  }

  const sortToDoList = todoList.filter((todo) => {
    if (sortCriteria === "All") return true;
    if (sortCriteria === "Completed" && todo.completed) return true;
    if (sortCriteria === "Not Completed" && !todo.completed) return true;
    return false;
  });

  const handleToggleCompleted = (id) => {
    dispatch(toggleCompleted({ id }));
  };
  return (
    <div>
      {showModal && (
        <div>
          <div>
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={
                currentTodo ? "Update your task here" : "Enter your task here"
              }
            />
            <div>
              {currentTodo ? (
                <>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleUpdateToDoList(currentTodo.id, newTask);
                    }}
                  >
                    Save
                  </button>
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                  <button
                    onClick={() => {
                      handleAddTodo(newTask);
                      setShowModal(false);
                    }}
                  >
                    Add
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        {todoList.length === 0 ? (
          <div>
            <div>
              <img src={empty} alt="" />
            </div>
            <p>You have no todo's, please add one.</p>
          </div>
        ) : (
          <div>
            <div>
              <select onChange={(e) => handleSort(e.target.value)}>
                <option value="All" className="text-sm">
                  All
                </option>
                <option value="Completed" className="text-sm">
                  Completed
                </option>
                <option value="Not Completed" className="text-sm">
                  Not Completed
                </option>
              </select>
            </div>
            <div>
              {sortToDoList.map((todo) => (
                <div key={todo.id}>
                  <div
                    className={`${
                      todo.completed
                        ? "line-through text-greenTeal"
                        : "text-sunsetOrange"
                    }`}
                    onClick={() => {
                      handleToggleCompleted(todo.id);
                    }}
                  >
                    {todo.task}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setCurrentTodo(todo);
                        setNewTask(todo.task);
                      }}
                    >
                      <TiPencil />
                    </button>
                    <button onClick={() => handleDeleteToDo(todo.id)}>
                      <BsTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => {
            setShowModal(true);
          }}
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

export default TodoList;
