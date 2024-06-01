import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "./scenes/Layout";
import Dashboard from "./scenes/Dashboard";
import Records from "./scenes/Records";
import Exhibitors from "./scenes/Exhibitors";
import Registrations from "./scenes/Registrations";

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/hello" element={<h1>hello</h1>} />
              <Route path="/records" element={<Records />} />
              <Route path="/exhibitors" element={<Exhibitors />} />
              <Route path="/registrations" element={<Registrations />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
