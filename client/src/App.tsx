import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
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
import HealthyRoutinesPage from "@/pages/resources/healthy-routines";
import PersonalProgressPage from "@/pages/resources/personal-progress";
import SelfCarePage from "@/pages/resources/self-care";
import SupportGroupsPage from "@/pages/resources/support-groups";
import MentalHealthMapPage from "@/pages/resources/mental-health-map";
import AdminSubscriptionsPage from "@/pages/admin/subscriptions";

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
      <ProtectedRoute path="/resources/healthy-routines" component={HealthyRoutinesPage} />
      <ProtectedRoute path="/resources/personal-progress" component={PersonalProgressPage} />
      <ProtectedRoute path="/resources/self-care" component={SelfCarePage} />
      <ProtectedRoute path="/resources/support-groups" component={SupportGroupsPage} />
      <ProtectedRoute path="/resources/mental-health-map" component={MentalHealthMapPage} />
      <ProtectedRoute path="/admin/subscriptions" component={AdminSubscriptionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PayPalScriptProvider 
        options={{
          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
          currency: "EUR",
          intent: "subscription",
          vault: true,
          components: "buttons",
          enableFunding: ["paypal"],
          disableFunding: ["card", "credit"],
        }}
        deferLoading={false}
      >
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </PayPalScriptProvider>
    </QueryClientProvider>
  );
}

export default App;