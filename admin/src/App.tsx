import { Route, Routes } from "react-router-dom";
import CustomLayout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import ListBooking from "./pages/ListBooking";
import ListRoom from "./pages/ListRoom";
import ListRoomType from "./pages/ListRoomType";
import ListUser from "./pages/ListUser";
import Login from "./pages/Login";
import ListReviews from "./pages/ListReviews";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <CustomLayout>
            <Dashboard />
          </CustomLayout>
        }
      />
      <Route
        path="/users"
        element={
          <CustomLayout>
            <ListUser />
          </CustomLayout>
        }
      />
      <Route
        path="/rooms"
        element={
          <CustomLayout>
            <ListRoom />
          </CustomLayout>
        }
      />
      <Route
        path="/reviews"
        element={
          <CustomLayout>
            <ListReviews />
          </CustomLayout>
        }
      />
      <Route
        path="/roomtypes"
        element={
          <CustomLayout>
            <ListRoomType />
          </CustomLayout>
        }
      />
      <Route
        path="/bookings"
        element={
          <CustomLayout>
            <ListBooking />
          </CustomLayout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

export default App;
