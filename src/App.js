import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Home from "./components/Home";
import About from "./components/About";
import NewsLetter from "./components/NewsLetter";
import Review from "./components/Reviews";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import Services from "./components/Services";

// import { CartProvider } from "./components/CartContext ";

function App() {
  const [booksData, setBooksData] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Add searchQuery state
  

  const getBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/books");
      setBooksData(response.data); // Directly use response.data
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="App">
      {/* Pass searchQuery and setSearchQuery to Header */}
 
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <About />
              <Services />
              <NewsLetter />
              <Review />
              <Projects />
              <Footer />
            </>
          }
        />
        <Route path="/About" element={<About />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Reviews" element={<Review />} />
        


      </Routes>
   
    </div>
  );
}

export default App;
