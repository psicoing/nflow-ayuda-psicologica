import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import HomePage from "@/pages/home-page";
import ChatPage from "@/pages/chat-page";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin/dashboard";
import SecretAdminPage from "@/pages/secret-admin";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import SubscriptionsPage from "@/pages/subscriptions";
import ResourcesPage from "@/pages/resources";
import AboutPage from "@/pages/about";
import BusinessServicesPage from "@/pages/services/business";
import PersonalServicesPage from "@/pages/services/personal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/services/business" component={BusinessServicesPage} />
      <Route path="/services/personal" component={PersonalServicesPage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin-secret-panel" component={SecretAdminPage} />
      <ProtectedRoute path="/subscriptions" component={SubscriptionsPage} />
      <ProtectedRoute path="/resources" component={ResourcesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;