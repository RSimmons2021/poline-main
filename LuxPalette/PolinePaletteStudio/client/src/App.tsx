import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ColorProvider } from "@/context/ColorContext";
import AppLayout from "@/components/layout/AppLayout";
import Explore from "@/pages/Explore";
import Painting from "@/pages/Painting";
import Fashion from "@/pages/Fashion";
import Interior from "@/pages/Interior";
import Library from "@/pages/Library";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Explore} />
        <Route path="/painting" component={Painting} />
        <Route path="/fashion" component={Fashion} />
        <Route path="/interior" component={Interior} />
        <Route path="/library" component={Library} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorProvider>
        <Toaster />
        <Router />
      </ColorProvider>
    </QueryClientProvider>
  );
}

export default App;
