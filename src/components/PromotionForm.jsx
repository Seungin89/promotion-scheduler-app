import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

const PromotionForm = ({ onAddPromotions }) => {
    const [rows, setRows] = useState([
        { id: Date.now(), name: "", startDate: "", endDate: "", color: "#3b82f6" },
    ]);

    const handleRowChange = (id, field, value) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const addRow = () => {
        setRows((prevRows) => [
            ...prevRows,
            {
                id: Date.now(),
                name: "",
                startDate: "",
                endDate: "",
                color: "#3b82f6",
            },
        ]);
    };

    const removeRow = (id) => {
        if (rows.length === 1) return; // Prevent removing the last row
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter out incomplete rows
        const validPromotions = rows
            .filter((row) => row.name && row.startDate && row.endDate)
            .map((row) => ({
                id: Math.random(), // Generate a new ID for the actual promotion
                name: row.name,
                startDate: new Date(row.startDate),
                endDate: new Date(row.endDate),
                color: row.color,
            }));

        if (validPromotions.length === 0) return;

        onAddPromotions(validPromotions);

        // Reset form to a single empty row
        setRows([
            { id: Date.now(), name: "", startDate: "", endDate: "", color: "#3b82f6" },
        ]);
    };

    return (
        <form className="promotion-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h3>Add Promotions</h3>
            </div>

            <div className="form-rows">
                {rows.map((row, index) => (
                    <div key={row.id} className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={row.name}
                                onChange={(e) => handleRowChange(row.id, "name", e.target.value)}
                                placeholder="Promotion Name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Start</label>
                            <input
                                type="date"
                                value={row.startDate}
                                onChange={(e) =>
                                    handleRowChange(row.id, "startDate", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End</label>
                            <input
                                type="date"
                                value={row.endDate}
                                onChange={(e) =>
                                    handleRowChange(row.id, "endDate", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="form-group color-group">
                            <label>Color</label>
                            <input
                                type="color"
                                value={row.color}
                                onChange={(e) =>
                                    handleRowChange(row.id, "color", e.target.value)
                                }
                            />
                        </div>
                        {rows.length > 1 && (
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => removeRow(row.id)}
                                title="Remove row"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="form-actions">
                <button type="button" className="add-row-btn" onClick={addRow}>
                    <Plus size={16} /> Add Row
                </button>
                <button type="submit" className="submit-btn">
                    Add All Promotions
                </button>
            </div>
        </form>
    );
};

export default PromotionForm;
