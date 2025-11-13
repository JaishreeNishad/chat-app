// import { Route, Routes } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./modules/Dashboard";
import Form from "./modules/Form";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem(`user:token`) !== null;
  if (!isLoggedIn) {
    return <Navigate to={`/users/sign_in`} />;
  } else if (
    isLoggedIn &&
    ["/users/sign_in", "/users/sign_up"].includes(window.location.pathname)
  ) {
    return <Navigate to={`/`} />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />{" "}
          </ProtectedRoute>
        }
      />

      <Route path="/users/sign_in" element={<Form isSignIn={true} />} />
      <Route path="/users/sign_up" element={<Form isSignIn={false} />} />
    </Routes>
  );
}

export default App;
