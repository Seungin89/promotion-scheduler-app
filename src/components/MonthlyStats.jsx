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
            padding: "15px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0"
        }}>
            {/* [B] Goal/Stats Summary Area */}
            <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>목표 매출</span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>₩ --</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>영업 이익</span>
                    <span style={{ fontWeight: "600", color: "#1e293b" }}>₩ --</span>
                </div>
            </div>

            {/* Center: Promotion Count */}
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {currentYear}년 {currentMonth + 1}월 프로모션: <span style={{ color: "#3b82f6" }}>{count}개</span>
            </div>

            {/* [A] Data Export Button */}
            <button
                style={{
                    padding: "8px 16px",
                    backgroundColor: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    color: "#475569",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    transition: "all 0.2s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#e2e8f0"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#f1f5f9"}
                onClick={() => alert("데이터 내보내기 기능은 준비 중입니다.")}
            >
                데이터 내보내기
            </button>
        </div>
    );
}
