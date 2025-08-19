import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Pos.css";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";


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
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleKeypadClick = (key) => {
    if (!selectedProduct) return;
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
    if (!selectedProduct) return;
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val) || val === "") setQuantity(val);
  };

  const handleCheck = () => {
    if (
      !selectedProduct ||
      !quantity ||
      isNaN(parseFloat(quantity)) ||
      parseFloat(quantity) <= 0
    ) {
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
        unitPrice: selectedProduct.price,
        taxAmount: selectedProduct.taxAmount || 0,
      },
    ]);

    setSelectedProduct(null);
    setQuantity("");
  };

  const handleSettleClick = () => {
    if (orderItems.length === 0) return;
    setShowPaymentOptions(true);
  };

  const handlePayment = async (method) => {
    setLoading(true);
    setShowPaymentOptions(false);

    const taxAmount = orderItems.reduce(
      (acc, item) => acc + item.taxAmount * item.quantity,
      0
    );
    const subtotal = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const totalAmount = subtotal + taxAmount;

    const payload = {
      customerId: null,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      discountAmount: 0,
      paymentMethod: method,
      items: orderItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const res = await fetch(`${API_URL}/smartflow-api/v1/sale/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error("Error registering sale: " + errorText);
      }

      const data = await res.json();
      console.log("Venta registrada:", data);

      setOrderItems([]);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al registrar la venta: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pos-container">
      <div className="pos-main">
        <div className="sidebar-buttons">
          {[
            "Select Customer",
            "Ticket Note",
            "Print Bill", 
          ].map((btn, idx) => (
            <button
              key={idx}
              disabled={btn === "Add Ticket"}
              className={`sidebar-btn ${btn === "Add Ticket" ? "disabled-btn" : ""}`}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="orders-panel">
          <div className="order-summary">
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
                $
                {orderItems
                  .reduce((acc, item) => acc + item.totalPrice, 0)
                  .toFixed(2)}
              </strong>
            </div>

            <div className="order-buttons">
              {!showPaymentOptions && (
                <button
                  className="settle-btn"
                  onClick={handleSettleClick}
                  disabled={loading || orderItems.length === 0}
                >
                  {loading ? "Processing..." : "Settle"}
                </button>
              )}
              <button className="close-btn-pos">Close</button>
            </div>

            {showPaymentOptions && (
              <div className="payment-options">
                <button
                  className="payment-btn cash-btn"
                  onClick={() => handlePayment("CASH")}
                  disabled={loading}
                >
                  <FaMoneyBillWave style={{ marginRight: 8 }} />
                  Cash
                </button>
                <button
                  className="payment-btn card-btn"
                  onClick={() => handlePayment("CARD")}
                  disabled={loading}
                >
                  <FaCreditCard style={{ marginRight: 8 }} />
                  Card
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="categories-products-keypad">
          <div className="cat-prod-keypad-container">
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

            <div className="products-and-keypad">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search products or barcode"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

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

              <div className="keypad-container">
                <div className="keypad-input-row">
                  <input
                    type="text"
                    className="keypad-input"
                    placeholder={
                      selectedProduct
                        ? selectedProduct.sellingUnit === "KG"
                          ? "Enter weight"
                          : "Enter quantity"
                        : "Select a product first"
                    }
                    value={quantity}
                    onChange={handleInputChange}
                  />
                  <div className="keypad-actions-right">
                    <button className="keypad-btn" onClick={handleCheck}>
                      ✔
                    </button>
                    <button
                      className="keypad-btn"
                      onClick={() => setQuantity("")}
                    >
                      ✖
                    </button>
                  </div>
                </div>
                <div className="keypad-grid">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "x"].map((key, idx) => (
                    <button
                      key={idx}
                      className="keypad-btn key"
                      onClick={() => handleKeypadClick(key)}
                    >
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
