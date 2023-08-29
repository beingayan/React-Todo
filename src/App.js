import { useState } from "react";

import "./App.css";
import TodoContainer from "./components/TodoContainer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="app-body">
        <h3 id="main-title">Todo App</h3>

        <TodoContainer />
      </div>
    </>
  );
}

export default App;
