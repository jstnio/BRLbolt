import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ShipmentDetails from './pages/ShipmentDetails';
import NewShipment from './pages/NewShipment';
import MasterData from './pages/MasterData';
import CustomerList from './pages/CustomerList';
import ShippingLineList from './pages/ShippingLineList';
import FreightForwarderList from './pages/FreightForwarderList';
import EntityList from './components/EntityList';
import ProtectedRoute from './components/ProtectedRoute';
import QuoteDashboard from './pages/QuoteDashboard';
import QuoteDetails from './pages/QuoteDetails';
import NewQuote from './pages/NewQuote';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Toast from './components/Toast';
import FinancialManagement from './pages/FinancialManagement';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Toast />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="profile"
            element={
              <ProtectedRoute role={['customer', 'manager']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute role={['customer', 'manager']}>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          {/* Customer Routes */}
          <Route
            path="customer"
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="manager/new"
            element={
              <ProtectedRoute role="manager">
                <NewShipment />
              </ProtectedRoute>
            }
          />

          {/* Financial Routes */}
          <Route
            path="financial"
            element={
              <ProtectedRoute role="manager">
                <FinancialManagement />
              </ProtectedRoute>
            }
          />

          {/* Quote Routes */}
          <Route
            path="quotes"
            element={
              <ProtectedRoute role="manager">
                <QuoteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="quotes/new"
            element={
              <ProtectedRoute role="manager">
                <NewQuote />
              </ProtectedRoute>
            }
          />
          <Route
            path="quotes/:id"
            element={
              <ProtectedRoute role="manager">
                <QuoteDetails />
              </ProtectedRoute>
            }
          />

          {/* Master Data Routes */}
          <Route
            path="master-data"
            element={
              <ProtectedRoute role="manager">
                <MasterData />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/customers"
            element={
              <ProtectedRoute role="manager">
                <CustomerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/shipping-lines"
            element={
              <ProtectedRoute role="manager">
                <ShippingLineList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/freight-forwarders"
            element={
              <ProtectedRoute role="manager">
                <FreightForwarderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/airports"
            element={
              <ProtectedRoute role="manager">
                <EntityList
                  collectionName="airports"
                  title="Airports"
                  renderExtraFields={(entity) => entity.code}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/airlines"
            element={
              <ProtectedRoute role="manager">
                <EntityList
                  collectionName="airlines"
                  title="Airlines"
                  renderExtraFields={(entity) => entity.code}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/ports"
            element={
              <ProtectedRoute role="manager">
                <EntityList
                  collectionName="ports"
                  title="Ports"
                  renderExtraFields={(entity) => entity.code}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/terminals"
            element={
              <ProtectedRoute role="manager">
                <EntityList
                  collectionName="terminals"
                  title="Terminals"
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/customs-brokers"
            element={
              <ProtectedRoute role="manager">
                <EntityList
                  collectionName="customsBrokers"
                  title="Customs Brokers"
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="master-data/truckers"
            element={
              <ProtectedRoute role="manager">
                <EntityList
                  collectionName="truckers"
                  title="Truckers"
                />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="shipment/:id"
            element={<ShipmentDetails />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;