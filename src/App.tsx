import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import SalesForm from "./components/salesForm";
import SalesList from "./components/salesList";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-100 py-4 md:py-8">
        <div className="container mx-auto px-4">
          <SalesForm />
          <div className="mt-8 md:mt-12">
            <SalesList />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
