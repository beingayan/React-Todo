import React, {
  useReducer,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
// import { #f9fbe7 } from '@mui/material/colors';

const label = { inputProps: { "aria-label": "completed" } };

/*
 * * * * * * * * * * * * * * * * * * * * * *
 *                                         *
 *        custom functions  -start         *
 *                                         *
 * * * * * * * * * * * * * * * * * * * * * *  *
 */
const getIntialTodo = () => {
  const getTodoList = window.localStorage.getItem("todoList");
  if (getTodoList) {
    return JSON.parse(getTodoList);
  }

  return [];
};

const intialTodo = {
  todoItemList: getIntialTodo(),
};

const addTodo = (state, action) => {
  state.todoItemList.push(action.payLoad);
  var getAllTodo = window.localStorage.getItem("todoList");

  if (getAllTodo) {
    const todoArray = JSON.parse(getAllTodo);
    todoArray.push({ ...action.payLoad });

    window.localStorage.setItem("todoList", JSON.stringify(todoArray));
  } else {
    window.localStorage.setItem(
      "todoList",
      JSON.stringify([
        {
          ...action.payLoad,
        },
      ])
    );
  }
  return state;
};

const editTodo = (state, action) => {
  var getAllTodo = window.localStorage.getItem("todoList");
  if (getAllTodo) getAllTodo = JSON.parse(getAllTodo);

  var updatedTodo = getAllTodo.map((val, i) => {
    if (i === action.payLoad.Id) {
      val.todoContent = action.payLoad.todoContent;
    }
    return val;
  });

  window.localStorage.setItem("todoList", JSON.stringify(updatedTodo));

  state.todoItemList = updatedTodo;

  return state;
};

const delTodo = (state, action) => {
  var getAllTodo = window.localStorage.getItem("todoList");
  if (getAllTodo) getAllTodo = JSON.parse(getAllTodo);

  var updatedTodo = getAllTodo.filter((data, i) => i !== action.payLoad.Id);

  window.localStorage.setItem("todoList", JSON.stringify(updatedTodo));

  state.todoItemList = updatedTodo;

  return state;
};

const completedTodo = (state, action) => {
  var getAllTodo = window.localStorage.getItem("todoList");
  if (getAllTodo) getAllTodo = JSON.parse(getAllTodo);

  var updatedTodo = getAllTodo.map((val, i) => {
    if (i === action.payLoad.Id) {
      val.IsCompleted = !val.IsCompleted;
    }
    return val;
  });

  window.localStorage.setItem("todoList", JSON.stringify(updatedTodo));

  state.todoItemList = updatedTodo;

  return state;
};

/*
 * * * * * * * * * * * * * * * * * * * * * *
 *                                         *
 *        custom functions  -end           *
 *                                         *
 * * * * * * * * * * * * * * * * * * * * * *  *
 */

/*
 * * * * * * * * * * * * * * * * * * * * * *
 *                                         *
 *         Reducers  - start               *
 *                                         *
 * * * * * * * * * * * * * * * * * * * * * *  *
 */

const todoReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return addTodo(state, action);

    case "edit":
      return editTodo(state, action);

    case "delete":
      return delTodo(state, action);

    case "completed":
      return completedTodo(state, action);
    default: 
    return state;
  }
};

/*
 * * * * * * * * * * * * * * * * * * * * * *
 *                                         *
 *         Reducers  - End                 *
 *                                         *
 * * * * * * * * * * * * * * * * * * * * * *  *
 */

const TodoList = forwardRef((props, ref) => {
  const { isAddTodo, setIsAddTod, selectedFilteredVal } = props.parentData;
  const [todoContent, setTodoContent] = useState("");
  const [todoItems, dispatchTodoITmes] = useReducer(todoReducer, intialTodo);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisibleById, setIsvisibleById] = useState(0);
  const [editTodo, setEditTod] = useState();
  const [Id, setId] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        getChildData() {
          return todoItems.todoItemList;
        },
      };
    },
    [todoItems]
  );

  const submitTodo = (type) => {
    dispatchTodoITmes({
      type: type.toLowerCase(),
      payLoad: { Id, todoContent, IsCompleted: false },
    });
    setIsAddTod(false);
    setTodoContent("");
    setIsvisibleById(0);
  };

  const handleTodoContent = (e, id = 0) => {
    setId(id);
    setTodoContent(e.target.value);
  };

  const handleEdit = (e, editId) => {
    setIsvisibleById(editId);
    setIsEdit(true);
    setTodoContent(e);
  };

  const { todoItemList } = todoItems;

  // This logic is written here wihtout react hook , to avoid useLess re-rendering;
  const filteredList =
    selectedFilteredVal === 1
      ? todoItemList.filter((todo) => todo.IsCompleted)
      : selectedFilteredVal === 2
      ? todoItemList.filter((todo) => !todo.IsCompleted)
      : todoItemList;

  return (
    <>
      <ul className="list-header" >
        {filteredList.length > 0 &&
          filteredList.map((data, i) => {
            return (
              <>
                <li
                  className="todo-list-items"
                  key={Math.random()}
                  style={{
                    display: `${isVisibleById === i + 1 ? "none" : "visible"}`,
                  }}
                >
                  <Checkbox
                    {...label}
                    sx={{
                      color: "#f9fbe7",
                      "&.Mui-checked": {
                        color: "#f9fbe7",
                      },
                    }}
                    onChange={() => {
                      dispatchTodoITmes({
                        type: "completed",
                        payLoad: { Id: i },
                      });

                      setRefresh((prev) => !prev);
                    }}
                    checked={data.IsCompleted}
                  />

                  <span
                    // className="list-content"
                    className={`${
                      data.IsCompleted
                        ? "text-with-thicker-line"
                        : "list-content"
                    }`}
                  >
                    {data.todoContent}
                  </span>

                  <div className="list-button">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(data.todoContent, i + 1)}
                    >
                      <BorderColorIcon
                        style={{ color: "greenyellow", fontSize: "2.2rem" }}
                      />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        dispatchTodoITmes({
                          type: "delete",
                          payLoad: { Id: i },
                        });

                        setRefresh((prev) => !prev);
                      }}
                    >
                      <DeleteIcon
                        style={{ color: "red", fontSize: "2.2rem" }}
                      />
                    </IconButton>{" "}
                  </div>
                </li>
                {isVisibleById === i + 1 && (
                  // <input
                  //   type="text"
                  //   name="edit-todo-item"
                  //   placeholder="Add new todo..."
                  //   onChange={handleTodoContent}
                  //   value={todoContent}
                  // />
                  <div className="add-content-field">
                    <input
                      type="text"
                      placeholder="Add new todo..."
                      onChange={(e) => handleTodoContent(e, i)}
                      value={todoContent}
                    />
                    <HighlightOffIcon
                      className="close-todo-icon"
                      onClick={() => {
                        setIsAddTod(false);
                        setTodoContent("");
                        setIsvisibleById(0);
                      }}
                    />
                    <Button
                      variant="contained"
                      className="add-todo-btn"
                      onClick={() => submitTodo("Edit")}
                      disabled={!todoContent.length}
                    >
                      Add{" "}
                    </Button>
                  </div>
                )}
              </>
            );
          })}
      </ul>
      {isAddTodo === true && (
        <div className="add-content-field">
          <input
            type="text"
            placeholder="Add new todo..."
            onChange={(e) => handleTodoContent(e)}
            value={todoContent}
          />
          <HighlightOffIcon
            className="close-todo-icon"
            onClick={() => {
              setIsAddTod(false);
              setTodoContent("");
            }}
          />
          <Button
            variant="contained"
            className="add-todo-btn"
            onClick={() => submitTodo("Add")}
            disabled={!todoContent.length}
          >
            Add{" "}
          </Button>
        </div>
      )}
    </>
  );
});

export default TodoList;
