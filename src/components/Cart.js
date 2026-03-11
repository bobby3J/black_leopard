import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = ({ closeCart }) => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart items from the backend
  const fetchCartItems = async () => {
    try {
      const token = document.cookie.split('=')[1]; // Extract token from cookies
      const response = await axios.get("http://localhost:8000/api/carts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const items = response.data[0]?.books || [];

      // Ensure quantity is initialized properly for each item
      const updatedItems = items.map(item => ({
        ...item,
        quantity: item.pivot?.quantity || 1 // Ensure we get the quantity from the pivot table or default to 1
      }));
     
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems); // Calculate initial total price after fetching items
    } catch (error) {
      setError("Failed to load cart items");
      console.error("Error fetching cart items:", error);
    }
  };

  // Calculate the total price of items
  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => {
      const itemPrice = item.price * (item.quantity || 1); // Ensure quantity is valid
      return sum + itemPrice;
    }, 0);
    setTotalPrice(total);
  };

  // Increase quantity and update on the server
  const handleIncreaseQuantity = async (bookId) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === bookId) {
        const newQuantity = item.quantity + 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);

    // Send updated quantity to the server
    try {
      const token = document.cookie.split('=')[1];
      const updatedItem = updatedItems.find(item => item.id === bookId);
      await axios.post(
        "http://localhost:8000/api/carts/update-quantity",
        { book_id: bookId, quantity: updatedItem.quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  // Decrease quantity and update on the server, ensuring it doesn't go below 1
  const handleDecreaseQuantity = async (bookId) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === bookId && item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);

    // Send updated quantity to the server
    try {
      const token = document.cookie.split('=')[1];
      const updatedItem = updatedItems.find(item => item.id === bookId);
      await axios.post(
        "http://localhost:8000/api/carts/update-quantity",
        { book_id: bookId, quantity: updatedItem.quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  // Remove item from the cart
  const handleRemoveFromCart = async (bookId) => {
    try {
      const token = document.cookie.split('=')[1];
      await axios.post(
        "http://localhost:8000/api/carts/remove",
        { book_id: bookId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCartItems(); // Refresh cart items after removal
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="cart-container fade-in">
      <button onClick={closeCart} className="close-cart-btn">×</button>
      <div className="addtocartsection">
        <div className="topsection">
          <span className="payondelivery">Pay on Delivery</span>
          <i className="fas fa-truck"></i>
        </div>

        <div className="content-container">
          {error && <p className="error-message">{error}</p>}
          {cartItems.length === 0 ? (
            <div className="empty-cart-section">
              <div className="gif-container">
                <img src="./images/emptycart.gif" alt="Empty Cart" />
              </div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((book) => (
              <div className="book-item" key={book.id}>
                <img src={book.image} alt={book.title} />
                <div className="book-details">
                  <h4>{book.title}</h4>
                  <p className="book-price">${book.price}</p>

                  <div className="quantity-controls">
                    <button onClick={() => handleDecreaseQuantity(book.id)}>-</button>
                    <span>{book.quantity}</span>
                    <button onClick={() => handleIncreaseQuantity(book.id)}>+</button>
                  </div>

                  <button onClick={() => handleRemoveFromCart(book.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mainrightsection">
          <div className="rightsection">
            <div className="textarea">
              <h3>Cart Summary</h3>
              <p>Review your items and proceed to checkout.</p>
            </div>

            <div className="pricearea">
              <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
              <p>(includes applicable taxes and delivery charges)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
