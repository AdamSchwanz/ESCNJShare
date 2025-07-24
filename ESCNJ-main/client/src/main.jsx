import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@ant-design/v5-patch-for-react-19';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import store from "./redux/store";
import { Provider } from "react-redux";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>,
)
