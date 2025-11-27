import React, { useState, useEffect } from "react";

export default function PromotionForm({ onAddPromotions, editingPromotion, onCancelEdit }) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedColor, setSelectedColor] = useState("#3b82f6");
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [bulkInput, setBulkInput] = useState("");

    const colors = [
        "#3b82f6", // Blue
        "#ef4444", // Red
        "#10b981", // Green
        "#f59e0b", // Yellow
        "#8b5cf6", // Purple
        "#ec4899", // Pink
        "#6b7280", // Gray
        "#FFA500", // Orange
    ];

    // Populate form when editingPromotion changes
    useEffect(() => {
        if (editingPromotion) {
            setName(editingPromotion.name);

            let start = editingPromotion.startDate;
            let end = editingPromotion.endDate;
            if (start && typeof start.toDate === 'function') start = start.toDate();
            if (end && typeof end.toDate === 'function') end = end.toDate();

            setStartDate(start ? new Date(start).toISOString().split('T')[0] : "");
            setEndDate(end ? new Date(end).toISOString().split('T')[0] : "");
            setSelectedColor(editingPromotion.color);
            setIsBulkMode(false);
        } else {
            resetForm();
        }
    }, [editingPromotion]);

    const resetForm = () => {
        setName("");
        setStartDate("");
        setEndDate("");
        setSelectedColor("#3b82f6");
        setBulkInput("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isBulkMode) {
            handleBulkSubmit();
            return;
        }

        if (!name || !startDate || !endDate) {
            alert("Please fill in all fields");
            return;
        }

        const newPromotion = {
            id: editingPromotion ? editingPromotion.id : null,
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            color: selectedColor,
        };

        onAddPromotions([newPromotion]);
        if (!editingPromotion) resetForm();
    };

    const handleBulkSubmit = () => {
        const lines = bulkInput.split("\n").filter((line) => line.trim() !== "");
        const newPromotions = [];

        for (const line of lines) {
            const parts = line.split(",").map((part) => part.trim());
            if (parts.length >= 3) {
                const [n, s, e, c] = parts;
                newPromotions.push({
                    id: null,
                    name: n,
                    startDate: new Date(s),
                    endDate: new Date(e),
                    color: c || selectedColor, // Use selected color if not specified
                });
            }
        }

        if (newPromotions.length > 0) {
            onAddPromotions(newPromotions);
            resetForm();
        }
    };

    return (
        <div className="promotion-form">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>{editingPromotion ? "Edit Promotion" : "Add Promotion"}</h3>
                {!editingPromotion && (
                    <button
                        type="button"
                        onClick={() => setIsBulkMode(!isBulkMode)}
                        style={{ fontSize: '0.8em', padding: '2px 5px', cursor: 'pointer' }}
                    >
                        {isBulkMode ? "Switch to Single" : "Switch to Bulk"}
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                {isBulkMode ? (
                    <>
                        <p style={{ fontSize: "0.8em", color: "#666", marginBottom: '5px' }}>
                            Format: Name, StartDate, EndDate, [Color]<br />
                            Color is optional, defaults to selected swatch.
                        </p>
                        <textarea
                            value={bulkInput}
                            onChange={(e) => setBulkInput(e.target.value)}
                            placeholder="Summer Sale, 2025-11-05, 2025-11-15, #3b82f6"
                            rows={5}
                            style={{ width: "100%", marginBottom: "10px", padding: '8px' }}
                        />
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '2px' }}>Promotion Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Summer Sale"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '2px' }}>Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '2px' }}>End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Color</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {colors.map(color => (
                            <div
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    cursor: 'pointer',
                                    border: selectedColor === color ? '2px solid #333' : '2px solid transparent',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {editingPromotion ? "Update Promotion" : "Add Promotion"}
                    </button>
                    {editingPromotion && (
                        <button type="button" onClick={onCancelEdit} style={{ padding: '10px', backgroundColor: "#ccc", border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
