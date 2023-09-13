import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./routes/routes";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  const PAYPAL_CLIENT =
    "ASHhTS9XDTGfV3TM-Y-qKREi9jRMxp6YYCsc3QbTxOOo2X6Wn2Q4h9CUeQXAbQ06htkyEwrDHCs1xYx3";
  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT }}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;
