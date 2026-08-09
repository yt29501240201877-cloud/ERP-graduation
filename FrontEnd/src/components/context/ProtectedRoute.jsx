// // components/ProtectedRoute.jsx
// import { Navigate } from "react-router";
// import { UseAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user } = UseAuth();

//   if (!user) {
//     return <Navigate to="/" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/Dashboard" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;