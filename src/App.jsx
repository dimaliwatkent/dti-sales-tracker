import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "./scenes/admin/Layout";
import Dashboard from "./scenes/admin/dashboard";
import Records from "./scenes/admin/records";
import Exhibitors from "./scenes/admin/exhibitors";
import Registrations from "./scenes/admin/registrations";
import SignIn from "./scenes/admin/signin";
import PrivateRoute from "./components/PrivateRoute";
import UserLayout from "./scenes/user/UserLayout";
import Sales from "./scenes/user/sales";
import Products from "./scenes/user/products";
import UserRecords from "./scenes/user/records";
import RestrictedRoute from "./components/RestrictedRoute";
import ThemeSwitcher from "./components/ThemeSwitcher";

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route element={<PrivateRoute />}>
              <Route element={<UserLayout />}>
                <Route
                  path="/"
                  element={<Navigate to="/user/sales" replace />}
                />
                <Route path="/user/sales" element={<Sales />} />
                <Route path="/user/records" element={<UserRecords />} />
                <Route path="/user/products" element={<Products />} />
              </Route>
            </Route>

            <Route element={<RestrictedRoute />}>
              <Route element={<Layout />}>
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/records" element={<Records />} />
                <Route path="/admin/exhibitors" element={<Exhibitors />} />
                <Route
                  path="/admin/registrations"
                  element={<Registrations />}
                />
              </Route>
            </Route>
          </Routes>

          <ThemeSwitcher />
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
