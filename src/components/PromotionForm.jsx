import React, { useState, useEffect } from "react";

export default function PromotionForm({ onAddPromotions, editingPromotion, onCancelEdit }) {
    const [input, setInput] = useState("");

    // Populate form when editingPromotion changes
    useEffect(() => {
        if (editingPromotion) {
            // Format: Name, YYYY-MM-DD, YYYY-MM-DD, #HexColor
            // Ensure we handle Date objects or Firestore Timestamps
            let start = editingPromotion.startDate;
            let end = editingPromotion.endDate;

            // Convert Firestore Timestamp to Date if necessary
            if (start && typeof start.toDate === 'function') start = start.toDate();
            if (end && typeof end.toDate === 'function') end = end.toDate();

            // Convert to string YYYY-MM-DD
            const startStr = start ? new Date(start).toISOString().split('T')[0] : '';
            const endStr = end ? new Date(end).toISOString().split('T')[0] : '';

            const line = `${editingPromotion.name}, ${startStr}, ${endStr}, ${editingPromotion.color}`;
            setInput(line);
        } else {
            setInput("");
        }
    }, [editingPromotion]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const lines = input.split("\n").filter((line) => line.trim() !== "");
        const newPromotions = [];

        for (const line of lines) {
            const parts = line.split(",").map((part) => part.trim());
            if (parts.length === 4) {
                const [name, startDate, endDate, color] = parts;
                newPromotions.push({
                    id: editingPromotion ? editingPromotion.id : null, // ID handled by App/Firestore
                    name,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    color,
                });
            }
        }

        if (newPromotions.length > 0) {
            onAddPromotions(newPromotions);
            if (!editingPromotion) {
                setInput("");
            }
        }
    };

    return (
        <div className="promotion-form">
            <h3>{editingPromotion ? "Edit Promotion" : "Add Promotions"}</h3>
            <p style={{ fontSize: "0.8em", color: "#666" }}>
                Format: Name, StartDate(YYYY-MM-DD), EndDate(YYYY-MM-DD), Color(#Hex)
                <br />
                Example: Summer Sale, 2025-11-05, 2025-11-15, #3b82f6
            </p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter promotion details..."
                    rows={5}
                    style={{ width: "100%", marginBottom: "10px" }}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" style={{ flex: 1 }}>
                        {editingPromotion ? "Update Promotion" : "Add Promotions"}
                    </button>
                    {editingPromotion && (
                        <button type="button" onClick={onCancelEdit} style={{ backgroundColor: "#ccc" }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
