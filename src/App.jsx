import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "./scenes/Layout";
import Dashboard from "./scenes/Dashboard";
import Records from "./scenes/Records";
import Exhibitors from "./scenes/Exhibitors";
import Registrations from "./scenes/Registrations";
import SignIn from "./scenes/SignIn";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/records" element={<Records />} />
                <Route path="/exhibitors" element={<Exhibitors />} />
                <Route path="/registrations" element={<Registrations />} />
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
