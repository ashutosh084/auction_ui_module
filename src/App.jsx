import { useEffect, useRef, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import getOrigin from "./utils/getHost";
import apiClient from "./utils/api";
import Header from "./components/Header";
import AddItemModal from "./components/AddItemModal";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [items, setItems] = useState([]);

  console.log("isAuthenticated", isAuthenticated);

  // Load items when authentication state changes to true
  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated]);

  // Load items from the server
  const loadItems = async () => {
    try {
      const response = await apiClient.get("/items");

      setItems(
        response.data.map((item) => ({
          name: item.name,
          price: item.price,
          pictures: item.images.map((img) => `${getOrigin()}/public/uploads/${img}`),
        }))
      );
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        // Session is invalid, redirect to login
        setIsAuthenticated(false);
        setItems([]);
      }
    }
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // loadItems will be called automatically via useEffect when isAuthenticated changes
  };

  // Handle successful signup
  const handleSignupSuccess = () => {
    setAuthMode("login");
    // Could also auto-login here if desired
  };

  // Show authentication screens if not authenticated
  if (!isAuthenticated) {
    if (authMode === "signup") {
      return (
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setAuthMode("login")}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setAuthMode("signup")}
      />
    );
  }

  // Show main app content for authenticated users
  return (
    <div className="App">
      <Header onLogout={() => {
        setIsAuthenticated(false);
        setItems([]);
      }} />
      <ul className="item-list">
        {items.map((item, index) => (
          <li
            key={index}
            className="item"
            onMouseEnter={() => {
              setHoveredIndex(index);
              setHoveredImageIndex(0);
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="item-image">
              <img
                src={
                  hoveredIndex === index
                    ? item.pictures[hoveredImageIndex]
                    : item.pictures[0]
                }
                alt={item.name}
                onMouseOver={() => {
                  if (hoveredIndex === index) {
                    setHoveredImageIndex(
                      (prev) => (prev + 1) % item.pictures.length
                    );
                  }
                }}
              />
            </div>
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>₹<b>{item.price}</b></p>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={() => setShowMenu(!showMenu)} className="add-item-button">
        {showMenu ? "Close Menu" : "Add Item"}
      </button>

      {showMenu && (
        <AddItemModal
          open={showMenu}
          onClose={() => setShowMenu(false)}
          onSuccess={loadItems}
          onFailure={() => {
            setIsAuthenticated(false);
            setItems([]);
          }}
        />
      )}
    </div>
  );
}

export default App;
