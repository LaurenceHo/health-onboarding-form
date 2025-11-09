import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import LeftDrawer from './components/left-drawer.tsx';
import './styles.css';
import reportWebVitals from './reportWebVitals.ts';
import SignUpFlow from './routes/sign-up/index.tsx';
import { RegistrationProvider } from '@/context/registration-context.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retryOnMount: true,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <>
      <LeftDrawer />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-up',
  component: SignUpFlow,
});

const routeTree = rootRoute.addChildren([indexRoute, signUpRoute]);

const router = createRouter({
  routeTree,
  context: { queryClient }, // Optional: pass queryClient to routes if needed
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// MSW setup
if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./handlers/browser.ts');
  // `worker.start()` returns a Promise
  worker.start({
    // Optional: ignore common false-positive warnings
    onUnhandledRequest: 'bypass',
  });
}

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RegistrationProvider>
          <RouterProvider router={router} />
          {/* Optional: React Query Devtools */}
          <ReactQueryDevtools initialIsOpen={false} />
        </RegistrationProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
