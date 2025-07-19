import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import ProjectDetail from "@/pages/project-detail";
import NotFound from "@/pages/not-found";
import AddProjectPage from "@/pages/add-project-page";
import EditProjectPage from "@/pages/edit-project-page";
import LoginPage from "@/pages/login-page";
import ProtectedRoute from "@/components/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/project/:id" component={ProjectDetail} />
      <Route path="/login" component={LoginPage} />
      <ProtectedRoute path="/admin/add-project" component={AddProjectPage} />
      <ProtectedRoute path="/admin/edit-project/:id" component={EditProjectPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
