import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ListRooms from "./pages/ListRooms";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import RoomDetail from "./pages/RoomDetail";
import Layout from "./layout/Layout";
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/rooms"
        element={
          <Layout>
            <ListRooms />
          </Layout>
        }
      />
      <Route
        path="/rooms/:id"
        element={
          <Layout>
            <RoomDetail />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="*"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
