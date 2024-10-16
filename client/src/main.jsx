import React from "react";
import ReactDom from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "React-router-dom";
import { AUTHContextProvider } from "./context/AuthContext.jsx";

// Tạo root DOM nơi ứng dụng React sẽ được render vào
ReactDom.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      {/* BrowserRouter cho phép định tuyến */}
      <BrowserRouter>
         {/* AUTHContextProvider cung cấp context cho các component con */}
         <AUTHContextProvider>
            {/* App là component chính của ứng dụng */}
            <App />
         </AUTHContextProvider>
      </BrowserRouter>
   </React.StrictMode>
);
