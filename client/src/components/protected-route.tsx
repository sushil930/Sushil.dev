import React from 'react';
import { Route, Redirect } from 'wouter';

// This is a placeholder for a real auth check
const isAuthenticated = () => {
  // In a real app, you'd check for a valid JWT or session cookie.
  // For now, we'll use sessionStorage as a simple flag.
  return sessionStorage.getItem('isAuthenticated') === 'true';
};

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      children={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
