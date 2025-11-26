import React from "react";

export default function Calendar({ currentDate, onDateChange, promotions }) {
    const monthNames = [
        "1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월",
    ];

    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    const handlePrevMonth = () => {
        onDateChange(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = () => {
        onDateChange(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const renderDays = () => {
        const calendarDays = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let i = 1; i <= days; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dayPromotions = promotions.filter((promo) => {
                const start = new Date(promo.startDate);
                const end = new Date(promo.endDate);
                // Reset hours to compare dates only
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);
                return date >= start && date <= end;
            });

            calendarDays.push(
                <div key={i} className="calendar-day">
                    <span className="day-number">{i}</span>
                    <div className="day-promotions">
                        {dayPromotions.map((promo) => (
                            <div
                                key={promo.id}
                                className="promotion-indicator"
                                style={{ backgroundColor: promo.color }}
                                title={promo.name}
                            >
                                {promo.name}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return calendarDays;
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>&lt;</button>
                <h2>
                    {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                </h2>
                <button onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-grid-header">
                {daysOfWeek.map((day) => (
                    <div key={day} className="day-name">
                        {day}
                    </div>
                ))}
            </div>
            <div className="calendar-grid">
                {renderDays()}
            </div>
        </div>
    );
}
