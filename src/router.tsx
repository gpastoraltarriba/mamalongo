// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import Login from "./pages/Login";
import Boards from "./pages/Boards";      // si quieres una vista de todos los tableros
import BoardView from "./pages/BoardView";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Boards /> },                 // opcional
      { path: "board/:boardId", element: <BoardView /> },   // usamos esta
    ],
  },
]);
