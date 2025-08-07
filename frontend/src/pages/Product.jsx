import React, { useState, useEffect } from "react";
import { FaEdit, FaPlus, FaTimes, FaTag, FaSave, FaLock, FaLockOpen } from "react-icons/fa";
import "../styles/Product.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    taxAmount: "",
    barCode: "",
    sellingUnit: "",
    categoryId: "",
  });
  // Estado para bloquear/desbloquear campos en edición
  const [fieldLocks, setFieldLocks] = useState({
    name: true,
    description: true,
    price: true,
    taxAmount: true,
    barCode: true,
    sellingUnit: true,
    categoryId: true,
  });

  const businessId = localStorage.getItem("businessId");

  useEffect(() => {
    if (!businessId) return;

    fetch(`${API_URL}/smartflow-api/v1/product/getAll/${businessId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, [businessId]);

  useEffect(() => {
    if (!businessId) return;

    fetch(`${API_URL}/smartflow-api/v1/category/getAll/${businessId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setCategories(data.data || []);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [businessId]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Permitir solo hasta 2 decimales en price y taxAmount
    if (["price", "taxAmount"].includes(name)) {
      const regex = /^\d*\.?\d{0,2}$/;
      if (!regex.test(value)) return;
    }

    // Permitir solo números en barcode
    if (name === "barCode") {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) return;
    }

    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  // Abrir modal añadir producto
  const handleOpenAddModal = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      taxAmount: "",
      barCode: "",
      sellingUnit: "",
      categoryId: "",
    });
    setIsAddModalOpen(true);
  };

  // Cerrar modal añadir producto
  const handleCloseAddModal = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      taxAmount: "",
      barCode: "",
      sellingUnit: "",
      categoryId: "",
    });
    setIsAddModalOpen(false);
  };

  // Añadir producto
  const handleAddProduct = (e) => {
    e.preventDefault();

    const payload = {
      businessId: parseInt(businessId),
      branchId: parseInt(businessId),
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(parseFloat(productForm.price).toFixed(2)),
      taxAmount: parseFloat(parseFloat(productForm.taxAmount).toFixed(2)),
      sellingUnit: productForm.sellingUnit,
      barCode: productForm.barCode,
      category: { id: parseInt(productForm.categoryId) },
    };

    fetch(`${API_URL}/smartflow-api/v1/product/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add product");
        return res.json();
      })
      .then(() => {
        handleCloseAddModal();
        // Recargar productos después de añadir
        fetchProducts();
      })
      .catch((err) => {
        console.error("Error creating product:", err);
        alert("Failed to create product.");
      });
  };

  // Abrir modal editar producto
  const handleOpenEditModal = (product) => {
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      taxAmount: product.taxAmount?.toString() || "",
      barCode: product.barCode || "",
      sellingUnit: product.sellingUnit || "",
      categoryId: product.category?.id?.toString() || "",
      id: product.id, // para referencia en edición (si la API requiere)
    });
    setFieldLocks({
      name: true,
      description: true,
      price: true,
      taxAmount: true,
      barCode: true,
      sellingUnit: true,
      categoryId: true,
    });
    setIsEditModalOpen(true);
  };

  // Cerrar modal editar producto
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setProductForm({
      name: "",
      description: "",
      price: "",
      taxAmount: "",
      barCode: "",
      sellingUnit: "",
      categoryId: "",
    });
  };

  // Alternar candado de un campo (lock/unlock)
  const toggleFieldLock = (field) => {
    setFieldLocks((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleEditProduct = (e) => {
    e.preventDefault();

    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(parseFloat(productForm.price).toFixed(2)),
      taxAmount: parseFloat(parseFloat(productForm.taxAmount).toFixed(2)),
      sellingUnit: productForm.sellingUnit,
      barCode: productForm.barCode,
      category: { id: parseInt(productForm.categoryId) },
      id: productForm.id, 
    };
    console.log("Payload to update product:", payload);
    console.log("Token:", localStorage.getItem("token"));
    


    fetch(`${API_URL}/smartflow-api/v1/product/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update product");
        return res.json();
      })
      .then(() => {
        handleCloseEditModal();
        fetchProducts();
      })
      .catch((err) => {
        console.error("Error updating product:", err);
        alert("Failed to update product.");
      });
  };

  // Función para recargar productos
  const fetchProducts = () => {
    if (!businessId) return;
    fetch(`${API_URL}/smartflow-api/v1/product/getAll/${businessId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  return (
    <div className="product-page">
      <div className="product-header">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="product-add-btn" onClick={handleOpenAddModal}>
          <FaPlus style={{ marginRight: "6px" }} /> Add
        </button>
      </div>

      <div className="product-grid-table">
        <div className="product-grid-header">Name</div>
        <div className="product-grid-header">Description</div>
        <div className="product-grid-header">Barcode</div>
        <div className="product-grid-header">Price</div>
        <div className="product-grid-header">Tax</div>
        <div className="product-grid-header">Unit</div>
        <div className="product-grid-header">Category</div>
        <div className="product-grid-header">Actions</div>

        {filtered.map((p, i) => (
          <React.Fragment key={i}>
            <div className="product-grid-cell">{p.name}</div>
            <div className="product-grid-cell description">{p.description}</div>
            <div className="product-grid-cell">{p.barCode || "—"}</div>
            <div className="product-grid-cell">{Number(p.price).toFixed(2)}</div>
            <div className="product-grid-cell">{Number(p.taxAmount).toFixed(2)}</div>
            <div className="product-grid-cell">{p.sellingUnit}</div>
            <div className="product-grid-cell">{p.category?.name || "—"}</div>
            <div className="product-grid-cell actions">
              <button onClick={() => handleOpenEditModal(p)}>
                <FaEdit /> Edit
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Modal Añadir Producto */}
      {isAddModalOpen && (
        <div className="product-modal-backdrop" onClick={handleCloseAddModal}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="product-modal-header">
              <h2>
                <FaTag style={{ marginRight: "6px" }} /> Add Product
              </h2>
              <button className="product-modal-close" onClick={handleCloseAddModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              {/* Campos idénticos a los tuyos para añadir */}
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Description:
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Barcode:
                <input
                  type="text"
                  name="barCode"
                  value={productForm.barCode}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Tax:
                <input
                  type="number"
                  name="taxAmount"
                  value={productForm.taxAmount}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Unit:
                <select
                  name="sellingUnit"
                  value={productForm.sellingUnit}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a unit</option>
                  <option value="KG">KG</option>
                  <option value="piece">Piece</option>
                  <option value="box">Box</option>
                </select>
              </label>

              <label>
                Category:
                <select
                  name="categoryId"
                  value={productForm.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="product-modal-buttons">
                <button type="submit">
                  <FaSave style={{ marginRight: "6px" }} />
                  Add
                </button>
                <button type="button" onClick={handleCloseAddModal}>
                  <FaTimes style={{ marginRight: "5px" }} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Producto con candados en inputs */}
      {isEditModalOpen && (
        <div className="product-modal-backdrop" onClick={handleCloseEditModal}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="product-modal-header">
              <h2>
                <FaTag style={{ marginRight: "6px" }} /> Edit Product
              </h2>
              <button className="product-modal-close" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleEditProduct}>

              <label style={{ position: "relative", display: "block", marginBottom: "1rem" }}>
                Name:
                <input
                  type="text"
                  name="name"
                  value={productForm.name}
                  onChange={handleInputChange}
                  required
                  disabled={fieldLocks.name}
                  style={{ paddingRight: "30px" }}
                />
                <button
                  type="button"
                  onClick={() => toggleFieldLock("name")}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "65%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    color: fieldLocks.name ? "#333" : "#007BFF",
                    fontSize: "18px",
                    lineHeight: "1",
                  }}
                  aria-label={fieldLocks.name ? "Unlock name field" : "Lock name field"}
                  title={fieldLocks.name ? "Unlock name field" : "Lock name field"}
                >
                  {fieldLocks.name ? <FaLock /> : <FaLockOpen />}
                </button>
              </label>

              <label style={{ position: "relative", display: "block", marginBottom: "1rem" }}>
                Description:
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleInputChange}
                  disabled={fieldLocks.description}
                  style={{ paddingRight: "30px" }}
                />
                <button
                  type="button"
                  onClick={() => toggleFieldLock("description")}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "55%",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    color: fieldLocks.description ? "#333" : "#007BFF",
                    fontSize: "18px",
                    lineHeight: "1",
                  }}
                  aria-label={fieldLocks.description ? "Unlock description field" : "Lock description field"}
                  title={fieldLocks.description ? "Unlock description field" : "Lock description field"}
                >
                  {fieldLocks.description ? <FaLock /> : <FaLockOpen />}
                </button>
              </label>

              <label style={{ position: "relative", display: "block", marginBottom: "1rem" }}>
                Barcode:
                <input
                  type="text"
                  name="barCode"
                  value={productForm.barCode}
                  onChange={handleInputChange}
                  disabled={fieldLocks.barCode}
                  style={{ paddingRight: "30px" }}
                />
                <button
                  type="button"
                  onClick={() => toggleFieldLock("barCode")}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "65%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    color: fieldLocks.barCode ? "#333" : "#007BFF",
                    fontSize: "18px",
                    lineHeight: "1",
                  }}
                  aria-label={fieldLocks.barCode ? "Unlock barcode field" : "Lock barcode field"}
                  title={fieldLocks.barCode ? "Unlock barcode field" : "Lock barcode field"}
                >
                  {fieldLocks.barCode ? <FaLock /> : <FaLockOpen />}
                </button>
              </label>

              <label style={{ position: "relative", display: "block", marginBottom: "1rem" }}>
                Price:
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleInputChange}
                  required
                  disabled={fieldLocks.price}
                  style={{ paddingRight: "30px" }}
                />
                <button
                  type="button"
                  onClick={() => toggleFieldLock("price")}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "70%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    color: fieldLocks.price ? "#333" : "#007BFF",
                    fontSize: "18px",
                    lineHeight: "1",
                  }}
                  aria-label={fieldLocks.price ? "Unlock price field" : "Lock price field"}
                  title={fieldLocks.price ? "Unlock price field" : "Lock price field"}
                >
                  {fieldLocks.price ? <FaLock /> : <FaLockOpen />}
                </button>
              </label>

              <label style={{ position: "relative", display: "block", marginBottom: "1rem" }}>
                Tax:
                <input
                  type="number"
                  name="taxAmount"
                  value={productForm.taxAmount}
                  onChange={handleInputChange}
                  disabled={fieldLocks.taxAmount}
                  style={{ paddingRight: "30px" }}
                />
                <button
                  type="button"
                  onClick={() => toggleFieldLock("taxAmount")}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "70%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    color: fieldLocks.taxAmount ? "#333" : "#007BFF",
                    fontSize: "18px",
                    lineHeight: "1",
                  }}
                  aria-label={fieldLocks.taxAmount ? "Unlock tax field" : "Lock tax field"}
                  title={fieldLocks.taxAmount ? "Unlock tax field" : "Lock tax field"}
                >
                  {fieldLocks.taxAmount ? <FaLock /> : <FaLockOpen />}
                </button>
              </label>

              <label style={{ position: "relative", display: "block", marginBottom: "1rem" }}>
                Unit:
                <select
                  name="sellingUnit"
                  value={productForm.sellingUnit}
                  onChange={handleInputChange}
                  required
                  disabled={fieldLocks.sellingUnit}
                  style={{ paddingRight: "30px" }}
                >
                  <option value="">Select a unit</option>
                  <option value="KG">KG</option>
                  <option value="piece">Piece</option>
                  <option value="box">Box</option>
                </select>
                <button
                  type="button"
                  onClick={() => toggleFieldLock("sellingUnit")}
                  style={{
                    position: "absolute",
                    right: "25px",
                    top: "70%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    color: fieldLocks.sellingUnit ? "#333" : "#007BFF",
                    fontSize: "18px",
                    lineHeight: "1",
                  }}
                  aria-label={fieldLocks.sellingUnit ? "Unlock unit field" : "Lock unit field"}
                  title={fieldLocks.sellingUnit ? "Unlock unit field" : "Lock unit field"}
                >
                  {fieldLocks.sellingUnit ? <FaLock /> : <FaLockOpen />}
                </button>
              </label>

              <label style={{ position: "relative", display: "block", marginBottom: "1rem" }}>
                Category:
                <select
                  name="categoryId"
                  value={productForm.categoryId}
                  onChange={handleInputChange}
                  required
                  disabled={fieldLocks.categoryId}
                  style={{ paddingRight: "30px" }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => toggleFieldLock("categoryId")}
                  style={{
                    position: "absolute",
                    right: "25px",
                    top: "70%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    margin: 0,
                    color: fieldLocks.categoryId ? "#333" : "#007BFF",
                    fontSize: "18px",
                    lineHeight: "1",
                  }}
                  aria-label={fieldLocks.categoryId ? "Unlock category field" : "Lock category field"}
                  title={fieldLocks.categoryId ? "Unlock category field" : "Lock category field"}
                >
                  {fieldLocks.categoryId ? <FaLock /> : <FaLockOpen />}
                </button>
              </label>

              <div className="product-modal-buttons">
                <button type="submit">
                  <FaSave style={{ marginRight: "6px" }} />
                  Save
                </button>
                <button type="button" onClick={handleCloseEditModal}>
                  <FaTimes style={{ marginRight: "5px" }} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
