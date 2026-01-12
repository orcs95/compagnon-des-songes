import { Navigate } from 'react-router-dom';

export default function Auth() {
  // Compat: redirect legacy `/auth` to the new `/connexion` page
  return <Navigate to="/connexion" replace />;
}

