import React from 'react';

export default function Dashboard({ promotions }) {
    // Dummy data for KWAY Goal
    const targetSales = "230억";
    const operatingProfit = "8%";
    const cumulativeSales = "203.00억";
    const currentProfit = "0%";
    const achievementRate = "88.26%";

    // Calculate monthly counts from promotions
    const getMonthlyCount = (month) => {
        return promotions.filter(p => {
            const d = new Date(p.startDate);
            return d.getMonth() + 1 === month;
        }).length;
    };

    const currentMonth = new Date().getMonth() + 1;
    const currentMonthCount = getMonthlyCount(currentMonth);

    // Dummy data for monthly breakdown text
    const prevMonthCount = getMonthlyCount(currentMonth - 1) || 81; // Fallback to dummy if 0
    const nextMonthCount = getMonthlyCount(currentMonth + 1) || 58; // Fallback to dummy if 0

    // Dummy data for manager stats
    const managerStats = [
        { count: 7, name: "권소유\n매니저", color: "#FFA500" },
        { count: 24, name: "연지원\n매니저", color: "#9ACD32" },
        { count: 17, name: "변수진\n매니저", color: "#00BFFF" },
        { count: 6, name: "신현재\n매니저", color: "#9370DB" },
        { count: 9, name: "문선주\n매니저", color: "#D3D3D3" },
    ];

    return (
        <div className="dashboard">
            <h2 style={{ color: '#E91E63', marginBottom: '10px' }}>KWAY Goal</h2>

            <div className="goal-cards">
                <div className="card dark">
                    <h3>목표 매출액</h3>
                    <div className="value">{targetSales}</div>
                </div>
                <div className="card dark">
                    <h3>영업이익</h3>
                    <div className="value">{operatingProfit}</div>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-box gray">
                    <h4>누적 매출액</h4>
                    <div className="stat-value yellow">{cumulativeSales}</div>
                </div>
                <div className="stat-box gray">
                    <h4>진행 영업이익</h4>
                    <div className="stat-value yellow">{currentProfit}</div>
                </div>
                <div className="stat-box gray">
                    <h4>달성률</h4>
                    <div className="stat-value yellow">{achievementRate}</div>
                </div>
            </div>

            <div className="sub-text">
                2024년 달성매출액: 221.92억<br />
                영업이익: 5.8%
            </div>

            <div className="development-status">
                <h3>공동구매 개발 진행 현황</h3>
                <div className="status-banner">
                    <div className="main-status">
                        {currentMonth}월: <span className="highlight">{currentMonthCount}건</span>
                    </div>
                    <div className="sub-status">
                        {currentMonth - 1}월 {prevMonthCount}건 / {currentMonth}월 {currentMonthCount}건 / {currentMonth + 1}월 {nextMonthCount}건
                    </div>
                </div>
            </div>

            <div className="manager-stats">
                {managerStats.map((stat, index) => (
                    <div key={index} className="manager-item">
                        <div className="circle" style={{ backgroundColor: stat.color }}>
                            {stat.count}건
                        </div>
                        <div className="manager-name">{stat.name}</div>
                    </div>
                ))}
            </div>

            <div className="monthly-sales-chart">
                <h3>월별 매출액 현황 <span style={{ fontSize: '0.8em', color: '#E91E63' }}>Goal 220억</span></h3>
                {/* Placeholder for bar chart - using simple CSS bars for now */}
                <div className="chart-placeholder">
                    {/* Simplified visual representation */}
                    <div className="chart-bars">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                            <div key={m} className="bar-col">
                                <div className="bar" style={{ height: `${Math.random() * 50 + 20}px` }}></div>
                                <span className="label">{m}월</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
