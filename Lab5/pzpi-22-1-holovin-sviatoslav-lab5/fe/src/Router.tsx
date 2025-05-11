import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import App from "./App";
import ACLWrapper from "./components/ACLWrapper";
import Home from "./components/Home";
import { DBMutate } from "./routes/DBMutate";
import LocationMutate from "./routes/LocationMutate";
import { LocationSearch } from "./routes/LocationSearch";
import { NotificationSearch } from "./routes/NotificationSearch";
import { OrderMutate } from "./routes/OrderMutate";
import { OrderSearch } from "./routes/OrderSearch";
import { ReportDetails } from "./routes/ReportDetails";
import { SensorDataSearch } from "./routes/SensorDataSearch";
import VaccineMutate from "./routes/VaccineMutate";
import { VaccineSearch } from "./routes/VaccineSearch";
import { ACL } from "./utils/ACL";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

const Router = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="*" element={<>Сторінку не знайдено</>} />

            <Route
              path="locations"
              element={
                <ACLWrapper fallback={<Navigate to="/" />} {...ACL.locations}>
                  <Outlet />
                </ACLWrapper>
              }
            >
              <Route index element={<LocationSearch />} />
              <Route path="create" element={<LocationMutate />} />
              <Route path="update/:id" element={<LocationMutate />} />

              <Route path="report/:id" element={<ReportDetails />} />
            </Route>

            <Route
              path="vaccines"
              element={
                <ACLWrapper fallback={<Navigate to="/" />} {...ACL.vaccines}>
                  <Outlet />
                </ACLWrapper>
              }
            >
              <Route index element={<VaccineSearch />} />
              <Route path="create" element={<VaccineMutate />} />
              <Route path="update/:id" element={<VaccineMutate />} />
            </Route>

            <Route
              path="orders"
              element={
                <ACLWrapper fallback={<Navigate to="/" />} {...ACL.orders}>
                  <Outlet />
                </ACLWrapper>
              }
            >
              <Route index element={<OrderSearch />} />
              <Route path="create" element={<OrderMutate />} />
              <Route path="update/:id" element={<OrderMutate />} />
            </Route>

            <Route
              path="notifications"
              element={
                <ACLWrapper
                  fallback={<Navigate to="/" />}
                  {...ACL.notifications}
                >
                  <Outlet />
                </ACLWrapper>
              }
            >
              <Route index element={<NotificationSearch />} />
            </Route>

            <Route
              path="backup"
              element={
                <ACLWrapper fallback={<Navigate to="/" />} {...ACL.backup}>
                  <Outlet />
                </ACLWrapper>
              }
            >
              <Route index element={<DBMutate />} />
            </Route>

            <Route
              path="sensor-data"
              element={
                <ACLWrapper fallback={<Navigate to="/" />} {...ACL.sensorData}>
                  <Outlet />
                </ACLWrapper>
              }
            >
              <Route index element={<SensorDataSearch />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default Router;
