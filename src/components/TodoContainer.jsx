import React, { useRef, useMemo, useState, useEffect } from "react";
// MIUI-components import
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TodoList from "./TodoList";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Main-components

function TodoContainer() {
  const [selectedFilteredVal, setSelectedFilteredVal] = useState(0);
  const [isAddTodo, setIsAddTod] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [open, setOpen] = useState(false);

  const todoListRef = useRef();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleChange = (e) => {
    setSelectedFilteredVal(e.target.value);
  };

  const addTodo = () => {
    const getChildItem = todoListRef.current.getChildData();
    if (getChildItem.length >= 6) {
      setOpen(true);
    } else {
      setIsAddTod(true);
    }
  };

  const propItems = {
    isAddTodo,
    setIsAddTod,
    selectedFilteredVal,
    setIsDisabled,
  };

  return (
    <Container maxWidth="sm" className="container">
      <div className="todo-container-header">
        <Button
          className="add-btn"
          variant="contained"
          onClick={addTodo}
          disabled={isDisabled}
        >
          Add Todo
        </Button>

        <Select
          value={selectedFilteredVal}
          onChange={handleChange}
          inputProps={{ "aria-label": "Without label" }}
          id="demo-select-small"
          style={{
            height: "31px",
            width: "26%",
            outline: "none",
            border: "none",
            background: "#1976d2",
          }}
        >
          <MenuItem value={0}>ALL</MenuItem>
          <MenuItem value={1}>Completed</MenuItem>
          <MenuItem value={2}>In complete</MenuItem>
        </Select>
        {/* {selectedFilteredVal} */}
      </div>

      <div className="todo-container">
        <TodoList parentData={propItems} ref={todoListRef} />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="warning" sx={{ width: "100%" }}>
          Since this is a lightweight to-do app, you have the capacity to add a
          maximum of six to-dos.
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default TodoContainer;
