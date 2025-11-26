import React from "react";

export default function MonthlyStats({ currentDate, promotions }) {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const count = promotions.filter((promo) => {
        // Check if promotion overlaps with the current month
        // Simple check: start date or end date is in the current month
        // Or better: check for overlap
        const promoStart = promo.startDate;
        const promoEnd = promo.endDate;

        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 0);

        return promoStart <= monthEnd && promoEnd >= monthStart;
    }).length;

    return (
        <div className="monthly-stats" style={{
            padding: "10px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            marginBottom: "10px",
            textAlign: "center",
            fontWeight: "bold"
        }}>
            {currentYear}년 {currentMonth + 1}월 프로모션: {count}개
        </div>
    );
}
