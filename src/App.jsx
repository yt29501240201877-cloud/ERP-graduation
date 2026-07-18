import React from "react";
import AppRouter from "./routes/AppRouter";

/**
 * Root application component.
 * Kept intentionally thin: all routing logic lives in AppRouter,
 * all layout/chrome lives in AppLayout.
 */
function App() {
  return <AppRouter />;
}

export default App;
