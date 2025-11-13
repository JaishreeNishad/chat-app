// import { Route, Routes } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./modules/Dashboard";
import Form from "./modules/Form";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/sign_in" element={<Form isSignIn={true} />} />
      <Route path="/sign_up" element={<Form isSignIn={false} />} />
    </Routes>
  );
}

export default App;
