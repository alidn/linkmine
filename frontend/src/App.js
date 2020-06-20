import React, { useState, useEffect, Suspense } from "react";
import "./App.css";
import Bookmarks from "./components/Bookmarks.js";
import Spinner from "./components/Spinner.js";
import AppBar from "./components/AppBar.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import {
  Notifications,
  getNotificationCreator,
} from "./components/notification";

function App() {
  let [isSidebarOpen, setSidebarOpen] = useState(true);

  let toggleSidebar = () => setSidebarOpen((isOpen) => !isOpen);
  let [addNotif, setAddNotif] = useState(() => {});

  useEffect(() => {
    setTimeout(() => {
      setAddNotif(getNotificationCreator);
    }, 0);
  }, []);

  return (
    <Router>
      <button onClick={() => addNotif("success", 2000)}>Notif</button>
      <Notifications />
      <div>
        <AppBar toggleSidebar={toggleSidebar} />
        <div id="main">
          <Sidebar isOpen={isSidebarOpen} />
          <Switch>
            <Route path="/bookmarks">
              <Suspense fallback={<Spinner />}>
                <Bookmarks />
              </Suspense>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
