import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUp from "./features/auth/SignUp";
import SignIn from "./features/auth/SignIn";
import UnAuthorized from "./features/UnAuthorized";
import Redirect from "./components/Redirect";
import RestrictedRoute from "./components/RestrictedRoute";
import Layout from "./components/Layout";

import {
  AdminDashboard,
  AdminRecords,
  AdminManagement,
  AddEvent,
  EditEvent,
  ViewEvent,
  ViewBusiness,
  AddBusiness,
  AdminRegistrations,
} from "./features/admin";

import {
  Sales,
  Products,
  Records,
  Registration,
  Events,
  ViewEvent as UserViewEvent,
  ApplicationForm,
  EditApplicationForm,
  Profile,
} from "./features/user";

import DataLoader from "./components/DataLoader";

function App() {
  return (
    <>
      <DataLoader />
      <BrowserRouter>
        <Routes>
          {/**
           * Public routes.
           */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />

          <Route path="/" element={<Redirect />} />

          {/**
           * Admin routes.
           */}
          <Route element={<RestrictedRoute allowedRoles={["admin"]} />}>
            <Route element={<Layout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/records" element={<AdminRecords />} />
              <Route path="/admin/management" element={<AdminManagement />} />
              <Route
                path="/admin/management/add-event"
                element={<AddEvent />}
              />
              <Route
                path="/admin/management/edit-event"
                element={<EditEvent />}
              />
              <Route
                path="/admin/management/view-event"
                element={<ViewEvent />}
              />
              <Route
                path="/admin/registrations"
                element={<AdminRegistrations />}
              />

              <Route
                path="/admin/management/view-business"
                element={<ViewBusiness />}
              />

              <Route
                path="/admin/management/add-business"
                element={<AddBusiness />}
              />

              <Route path="/admin/profile" element={<Profile />} />
            </Route>
          </Route>

          {/**
           * User routes.
           */}
          <Route element={<RestrictedRoute allowedRoles={["user"]} />}>
            <Route element={<Layout />}>
              <Route path="/sales" element={<Sales />} />
              <Route path="/records" element={<Records />} />
              <Route path="/products" element={<Products />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/view-event" element={<UserViewEvent />} />
              <Route path="/events/application" element={<ApplicationForm />} />
              <Route
                path="/events/edit-application"
                element={<EditApplicationForm />}
              />
            </Route>
          </Route>

          <Route
            element={
              <RestrictedRoute allowedRoles={["newUser", "pendingUser"]} />
            }
          >
            <Route element={<Layout />}>
              <Route path="/registration" element={<Registration />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
