import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Pos.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Pos() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate("/dashboard");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const businessId = localStorage.getItem("businessId");
    const token = localStorage.getItem("token");
    if (!businessId || !token) return;

    try {
      const response = await fetch(
        `${API_URL}/smartflow-api/v1/category/getAll/${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();
      const data = Array.isArray(json) ? json : json.data || [];
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/smartflow-api/v1/product/getallByCategory/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();
      const data = Array.isArray(json) ? json : json.data || [];
      setProducts(data);
      setSelectedProduct(null);
      setQuantity("");
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredProducts = products.filter((product) => {
    const query = productSearch.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.barCode && product.barCode.toLowerCase().includes(query))
    );
  });

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity("");
  };

  // Solo cambia cantidad si hay producto seleccionado
  const handleKeypadClick = (key) => {
    if (!selectedProduct) return; // No hacer nada si no hay producto

    if (key === "x") {
      setQuantity("");
    } else {
      const newValue = quantity + key;
      if (/^\d*\.?\d*$/.test(newValue)) {
        setQuantity(newValue);
      }
    }
  };

  const handleInputChange = (e) => {
    if (!selectedProduct) return; // No cambiar si no hay producto
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val) || val === "") setQuantity(val);
  };

  const handleCheck = () => {
    if (!selectedProduct || !quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
      return;
    }

    const qty = parseFloat(quantity);
    const totalPrice = qty * selectedProduct.price;

    setOrderItems((prev) => [
      ...prev,
      {
        id: selectedProduct.id,
        name: selectedProduct.name,
        quantity: qty,
        totalPrice: totalPrice,
      },
    ]);

    setSelectedProduct(null);
    setQuantity("");
  };

  return (
    <div className="pos-container">
      <div className="pos-main">
        <div className="sidebar-buttons">
          {["Change Table", "Select Customer", "Ticket Note", "Print Bill", "Add Ticket"].map(
            (btn, idx) => (
              <button
                key={idx}
                disabled={btn === "Add Ticket"}
                className={`sidebar-btn ${btn === "Add Ticket" ? "disabled-btn" : ""}`}
              >
                {btn}
              </button>
            )
          )}
        </div>
        <div className="orders-panel">
          <div className="order-summary">
            {/* Header tipo tabla */}
            <div className="order-header-grid">
              <span className="quantity-header">Q</span>
              <span className="product-name-header">Name</span>
              <span className="price-header">$</span>
            </div>

            <hr />

            <ul className="order-list">
              {orderItems.length === 0 && <li>No items in order.</li>}
              {orderItems.map((item, idx) => (
                <li key={idx} className="order-item-grid">
                  <span className="quantity">{item.quantity}</span>
                  <span className="product-name">{item.name}</span>
                  <span className="price">${item.totalPrice.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="orders-bottom">
            <div className="balance-outside">
              <strong className="balance-label">Balance:</strong>
              <strong className="balance-amount">
                ${orderItems.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2)}
              </strong>
            </div>

            <div className="order-buttons">
              <button className="settle-btn">Settle</button>
              <button className="close-btn-pos">Close</button>
            </div>
          </div>
        </div>


        {/* Categories + Products + Keypad */}
        <div className="categories-products-keypad">
          <div className="cat-prod-keypad-container">
            {/* Search & Categories */}
            <div className="categories-list-vertical">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search categories"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  className="category-btn"
                  onClick={() => fetchProductsByCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Products + Keypad */}
            <div className="products-and-keypad">
              {/* Product Search */}
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search products or barcode"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              {/* Products */}
              <div className="products-grid">
                {filteredProducts.map((prod) => (
                  <button
                    key={prod.id}
                    className={`product-btn ${selectedProduct?.id === prod.id ? "selected-product" : ""
                      }`}
                    onClick={() => handleProductClick(prod)}
                  >
                    {prod.name}
                  </button>
                ))}
              </div>

              {/* Keypad */}
              <div className="keypad-container">
                <div className="keypad-input-row">
                  <input
                    type="text"
                    className="keypad-input"
                    placeholder={selectedProduct ? "Enter quantity" : "Select a product first"}
                    value={quantity}
                    onChange={handleInputChange}
                  />
                  <div className="keypad-actions-right">
                    <button className="keypad-btn" onClick={handleCheck}>
                      ✔
                    </button>
                    <button className="keypad-btn" onClick={() => setQuantity("")}>
                      ✖
                    </button>
                  </div>
                </div>
                <div className="keypad-grid">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "x"].map((key, idx) => (
                    <button key={idx} className="keypad-btn key" onClick={() => handleKeypadClick(key)}>
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
