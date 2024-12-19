import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignUp from "./features/auth/SignUp";
import SignIn from "./features/auth/SignIn";
import ForgotPassword from "./features/auth/ForgotPassword";
import ResetPassword from "./features/auth/ResetPassword";
import ResetComplete from "./features/auth/ResetComplete";
import UnAuthorized from "./features/UnAuthorized";
import Redirect from "./components/Redirect";
import RestrictedRoute from "./components/RestrictedRoute";
import Layout from "./components/Layout";

import Profile from "./features/profile";

import {
  AdminDashboard,
  AdminRecords,
  AdminManagement,
  AddEvent,
  EditEvent,
  ViewEvent,
  Booth,
  ViewBusiness,
  AdminRegistrations,
} from "./features/admin";

import {
  Sales,
  // Records,
  Registration,
  Events,
  ViewEvent as UserViewEvent,
  ApplicationForm,
  EditApplicationForm,
} from "./features/user";

import {
  MonitorEvents,
  MonitorViewEvent,
  MonitorViewBusiness,
  MonitorInfo,
} from "./features/monitor";

import ViewNotification from "./features/notification/ViewNotification";

import {
  EventViolation,
  EventViolationList,
  ViewViolation,
} from "./features/violation";

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset" element={<ResetPassword />} />
          <Route path="/password-reset/complete" element={<ResetComplete />} />
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
                path="/admin/management/edit-event/:id"
                element={<EditEvent />}
              />
              <Route
                path="/admin/management/view-event/:id"
                element={<ViewEvent />}
              />
              <Route
                path="/admin/management/view-event/booth/:id"
                element={<Booth />}
              />
              <Route
                path="/admin/registrations"
                element={<AdminRegistrations />}
              />

              <Route
                path="/admin/management/view-business/:id/:type"
                element={<ViewBusiness />}
              />

              <Route
                path="/admin/management/violation/event-violation/:id"
                element={<EventViolationList />}
              />

              <Route
                path="/admin/management/violation/view-violation/:id"
                element={<ViewViolation />}
              />

              <Route
                path="/admin/management/violation/:id"
                element={<EventViolation />}
              />

              <Route path="/admin/profile" element={<Profile />} />

              <Route
                path="/admin/notification/view-notification"
                element={<ViewNotification />}
              />
            </Route>
          </Route>

          {/**
           * User routes.
           */}
          <Route element={<RestrictedRoute allowedRoles={["user"]} />}>
            <Route element={<Layout />}>
              <Route path="/sales" element={<Sales />} />
              {/*
              <Route path="/records" element={<Records />} />
              */}
              <Route path="/events" element={<Events />} />
              <Route
                path="/events/view-event/:id"
                element={<UserViewEvent />}
              />
              <Route
                path="/events/business/view-business/:id/:type"
                element={<ViewBusiness />}
              />
              <Route
                path="/events/violation/view-violation/:id"
                element={<ViewViolation />}
              />

              <Route
                path="/events/application/:id"
                element={<ApplicationForm />}
              />
              <Route
                path="/events/edit-application/:id"
                element={<EditApplicationForm />}
              />

              <Route path="/profile" element={<Profile />} />

              <Route
                path="/notification/view-notification"
                element={<ViewNotification />}
              />
            </Route>
          </Route>

          {/**
           * Monitor routes.
           */}
          <Route element={<RestrictedRoute allowedRoles={["monitor"]} />}>
            <Route element={<Layout />}>
              <Route path="/monitor/events" element={<MonitorEvents />} />
              <Route
                path="/monitor/events/view-event/:id"
                element={<MonitorViewEvent />}
              />
              <Route
                path="/monitor/events/view-business/:businessId/:eventId"
                element={<MonitorViewBusiness />}
              />
              <Route path="/monitor/info" element={<MonitorInfo />} />

              <Route
                path="/monitor/notification/view-notification"
                element={<ViewNotification />}
              />

              <Route path="/monitor/profile" element={<Profile />} />
            </Route>
          </Route>

          {/**
           * Other user routes.
           */}
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
