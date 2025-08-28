import React, { useState, useRef } from "react";
import apiClient from "../utils/api";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function AddItemModal({ open, onClose, onSuccess, onFailure }) {
    const [newItem, setNewItem] = useState({ name: "", price: "", pictures: [] });
    const [warning, setWarning] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };
    const handleDragOver = (e) => { e.preventDefault(); };
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };
    const processFiles = (files) => {
        if (files.length > 5) {
            setWarning("You can upload a maximum of 5 images.");
            return;
        }
        setWarning("");
        setNewItem({ ...newItem, pictures: files });
    };
    const removeImage = (index) => {
        const updatedPictures = newItem.pictures.filter((_, i) => i !== index);
        setNewItem({ ...newItem, pictures: updatedPictures });
    };
    const addItem = async () => {
        if (newItem.name && newItem.price && newItem.pictures.length) {
            try {
                const formData = new FormData();
                formData.append("name", newItem.name);
                formData.append("price", newItem.price);
                newItem.pictures.forEach((file) => formData.append("images", file));
                const response = await apiClient.post("/items", formData);
                if (response.status === 201) {
                    setNewItem({ name: "", price: "", pictures: [] });
                    setWarning("");
                    onSuccess?.();
                }
            } catch (error) {
                if (error.response && (error.response.status === 400 || error.response.status === 401)) {
                    setWarning("");
                    onFailure?.();
                } else {
                    setWarning("Failed to add item. Please check your connection.");
                }
            }
        } else {
            setWarning("All fields are mandatory!");
        }
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", boxShadow: 24, p: 4, minWidth: 400 }}>
                <h2 style={{ color: "rgba(0, 0, 0, .8)" }}>Add New Item</h2>
                <TextField fullWidth margin="normal" label="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                <TextField fullWidth margin="normal" type="number" label="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
                <Box className="drag-drop" sx={{ border: "1px dashed #aaa", p: 2, mb: 2, cursor: "pointer" }} onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                    <p>Click or drag and drop up to 5 images here</p>
                    <input type="file" multiple accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileSelect} />
                    {newItem.pictures && newItem.pictures.length > 0 && (
                        <Box className="preview" sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {newItem.pictures.map((file, index) => (
                                <Box key={index} className="preview-item" sx={{ position: "relative" }}>
                                    <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }} />
                                    <Button size="small" sx={{ position: "absolute", top: 0, right: 0, minWidth: 0, p: 0 }} onClick={(e) => { e.stopPropagation(); removeImage(index); }}>✕</Button>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
                {warning && (
                    <Box sx={{ background: "#ffdddd", color: "#b71c1c", p: 1, mb: 2, borderRadius: 1, textAlign: "center" }}>
                        {warning}
                    </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button variant="contained" onClick={addItem}>Submit</Button>
                    <Button variant="outlined" onClick={onClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
}