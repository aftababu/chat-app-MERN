import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/ChatContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
 <ChakraProvider theme={theme}>
        <BrowserRouter>
      <ChatProvider>
          <App />
      </ChatProvider>
        </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)
