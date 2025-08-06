import React, { useState, useEffect } from "react";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaTag,
    FaLock,
    FaUnlock,
} from "react-icons/fa";
import "../styles/Category.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Category() {
    const [filter, setFilter] = useState("");
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });
    const [editCategory, setEditCategory] = useState({ id: null, name: "", description: "" });
    const [editIndex, setEditIndex] = useState(null);
    const [lockedFields, setLockedFields] = useState({ name: true, description: true });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const businessId = localStorage.getItem("businessId");
        const token = localStorage.getItem("token");

        if (!businessId || !token) {
            console.error("Missing businessId or token.");
            return;
        }

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

            if (!response.ok) throw new Error("Failed to fetch categories");

            const json = await response.json();

            const data = Array.isArray(json) ? json : json.data || [];

            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    const handleAdd = () => {
        setNewCategory({ name: "", description: "" });
        setErrorMessage("");
        setShowAddModal(true);
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({ ...prev, [name]: value }));
        setErrorMessage("");
    };

    const handleAddSubmit = async () => {
        if (!newCategory.name || !newCategory.description) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        const businessId = parseInt(localStorage.getItem("businessId"));
        const branchId = businessId;
        const token = localStorage.getItem("token");

        if (!businessId || !token) {
            setErrorMessage("Missing token or business ID.");
            return;
        }

        const payload = {
            name: newCategory.name,
            description: newCategory.description,
            businessId,
            branchId,
        };

        try {
            const response = await fetch(`${API_URL}/smartflow-api/v1/category/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to create category.");
                return;
            }

            setShowAddModal(false);
            setNewCategory({ name: "", description: "" });
            fetchCategories();
        } catch (error) {
            console.error("Error creating category:", error);
            setErrorMessage("Server error. Please try again later.");
        }
    };

    const handleEdit = (index) => {
        setEditCategory(categories[index]);
        setEditIndex(index);
        setLockedFields({ name: true, description: true });
        setErrorMessage("");
        setShowEditModal(true);
    };

    const toggleLock = (field) => {
        setLockedFields((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (!lockedFields[name]) {
            setEditCategory((prev) => ({ ...prev, [name]: value }));
            setErrorMessage("");
        }
    };

    const handleEditSubmit = async () => {
        if (!editCategory.name || !editCategory.description) {
            setErrorMessage("Please fill in all fields.");
            return;
        }
        const businessId = parseInt(localStorage.getItem("businessId"));
        const branchId = businessId;
        
        const token = localStorage.getItem("token");
        if (!token) {
            setErrorMessage("Missing token.");
            return;
        }
        const payUpdate = {
            id: editCategory.id,
            name: newCategory.name,
            description: newCategory.description,
            businessId,
            branchId,
        };
        try {
            const response = await fetch(`${API_URL}/smartflow-api/v1/category/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payUpdate),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to update category.");
                return;
            }

            const updated = [...categories];
            updated[editIndex] = editCategory;
            setCategories(updated);
            setShowEditModal(false);
        } catch (error) {
            console.error("Error updating category:", error);
            setErrorMessage("Server error. Please try again later.");
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="category-page">
            <div className="header">
                <input
                    type="text"
                    placeholder="Filter by name..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <button className="add-btn" onClick={handleAdd}>
                    <FaPlus style={{ marginRight: "6px" }} />
                    Add
                </button>
            </div>
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal modal-add">
                        <div className="modal-header">
                            <h2>
                                <FaTag style={{ marginRight: "6px" }} /> Add Category
                            </h2>
                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setErrorMessage("");
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <input
                            type="text"
                            name="name"
                            placeholder="Category Name"
                            value={newCategory.name}
                            onChange={handleAddChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Category Description"
                            value={newCategory.description}
                            onChange={handleAddChange}
                        ></textarea>

                        {errorMessage && (
                            <div style={{ color: "red", marginTop: "8px" }}>{errorMessage}</div>
                        )}

                        <div className="modal-buttons">
                            <button onClick={handleAddSubmit}>
                                <FaPlus style={{ marginRight: "5px" }} />
                                Add
                            </button>
                            <button
                                className="cancel"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setErrorMessage("");
                                }}
                            >
                                <FaTimes style={{ marginRight: "5px" }} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal modal-edit">
                        <div className="modal-header">
                            <h2>
                                <FaEdit style={{ marginRight: "6px" }} /> Edit Category
                            </h2>
                            <button
                                className="close-btn"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setErrorMessage("");
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div style={{ position: "relative", marginBottom: 15 }}>
                            <input
                                type="text"
                                name="name"
                                value={editCategory.name}
                                disabled={lockedFields.name}
                                onChange={handleEditChange}
                                style={{ paddingRight: 30, width: "90%" }}
                            />
                            <button
                                onClick={() => toggleLock("name")}
                                style={{
                                    position: "absolute",
                                    right: 5,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: lockedFields.name ? "gray" : "green",
                                }}
                                aria-label={lockedFields.name ? "Unlock name" : "Lock name"}
                            >
                                {lockedFields.name ? <FaLock /> : <FaUnlock />}
                            </button>
                        </div>

                        <div style={{ position: "relative", marginBottom: 15 }}>
                            <textarea
                                name="description"
                                value={editCategory.description}
                                disabled={lockedFields.description}
                                onChange={handleEditChange}
                                style={{ paddingRight: 30, width: "90%" }}
                            />
                            <button
                                onClick={() => toggleLock("description")}
                                style={{
                                    position: "absolute",
                                    right: 5,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: lockedFields.description ? "gray" : "green",
                                }}
                                aria-label={lockedFields.description ? "Unlock" : "Lock"}
                            >
                                {lockedFields.description ? <FaLock /> : <FaUnlock />}
                            </button>
                        </div>

                        {errorMessage && (
                            <div style={{ color: "red", marginBottom: 10 }}>{errorMessage}</div>
                        )}

                        <div className="modal-buttons">
                            <button onClick={handleEditSubmit}>
                                <FaEdit style={{ marginRight: "5px" }} />
                                Save
                            </button>
                            <button
                                className="cancel"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setErrorMessage("");
                                }}
                            >
                                <FaTimes style={{ marginRight: "5px" }} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid-table">
                <div className="grid-header">Name</div>
                <div className="grid-header">Description</div>
                <div className="grid-header">Actions</div>

                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                        <React.Fragment key={category.id || index}>
                            <div className="grid-cell">{category.name}</div>
                            <div className="grid-cell">{category.description}</div>
                            <div className="grid-cell actions">
                                <button className="edit-btn" onClick={() => handleEdit(index)}>
                                    <FaEdit /> Edit
                                </button>
                            </div>
                        </React.Fragment>
                    ))
                ) : (
                    <div className="grid-cell" style={{ gridColumn: '1 / -1' }}>
                        No categories found.
                    </div>
                )}
            </div>


        </div>
    );
}
