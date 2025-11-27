import React, { useMemo } from "react";

export default function Calendar({ currentDate, onDateChange, promotions }) {
    const monthNames = [
        "1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월",
    ];

    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

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

    // Generate calendar grid data
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

        const endDate = new Date(lastDayOfMonth);
        if (endDate.getDay() !== 6) {
            endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday
        }

        const weeks = [];
        let currentWeek = [];
        let day = new Date(startDate);

        while (day <= endDate) {
            currentWeek.push(new Date(day));
            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            day.setDate(day.getDate() + 1);
        }

        return weeks;
    }, [currentDate]);

    // Process promotions for each week
    const getWeekPromotions = (weekStart, weekEnd) => {
        // Filter promotions active in this week
        const activePromos = promotions.filter(p => {
            const pStart = new Date(p.startDate);
            const pEnd = new Date(p.endDate);
            pStart.setHours(0, 0, 0, 0);
            pEnd.setHours(0, 0, 0, 0);

            return pStart <= weekEnd && pEnd >= weekStart;
        });

        // Sort by start date, then duration
        activePromos.sort((a, b) => {
            const aStart = new Date(a.startDate);
            const bStart = new Date(b.startDate);
            if (aStart.getTime() !== bStart.getTime()) return aStart - bStart;
            return (b.endDate - b.startDate) - (a.endDate - a.startDate);
        });

        // Assign slots
        const slots = []; // Array of arrays (rows)
        const promoWithSlots = activePromos.map(p => {
            const pStart = new Date(p.startDate);
            const pEnd = new Date(p.endDate);
            pStart.setHours(0, 0, 0, 0);
            pEnd.setHours(0, 0, 0, 0);

            // Clip to week boundaries for rendering
            const renderStart = pStart < weekStart ? weekStart : pStart;
            const renderEnd = pEnd > weekEnd ? weekEnd : pEnd;

            const startDayIndex = Math.floor((renderStart - weekStart) / (1000 * 60 * 60 * 24));
            const endDayIndex = Math.floor((renderEnd - weekStart) / (1000 * 60 * 60 * 24));
            const span = endDayIndex - startDayIndex + 1;

            // Find first available slot
            let slotIndex = 0;
            while (true) {
                if (!slots[slotIndex]) {
                    slots[slotIndex] = new Array(7).fill(false);
                }

                let isAvailable = true;
                for (let i = startDayIndex; i <= endDayIndex; i++) {
                    if (slots[slotIndex][i]) {
                        isAvailable = false;
                        break;
                    }
                }

                if (isAvailable) {
                    // Mark slot as used
                    for (let i = startDayIndex; i <= endDayIndex; i++) {
                        slots[slotIndex][i] = true;
                    }
                    return {
                        ...p,
                        startDayIndex,
                        span,
                        slotIndex,
                        isStart: pStart >= weekStart,
                        isEnd: pEnd <= weekEnd
                    };
                }
                slotIndex++;
            }
        });

        return { promoWithSlots, maxSlots: slots.length };
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
            <div className="calendar-body">
                {calendarData.map((week, weekIndex) => {
                    const weekStart = week[0];
                    const weekEnd = week[6];
                    // Set hours to end of day for weekEnd comparison
                    const weekEndCompare = new Date(weekEnd);
                    weekEndCompare.setHours(23, 59, 59, 999);

                    const { promoWithSlots, maxSlots } = getWeekPromotions(weekStart, weekEndCompare);

                    // Calculate row height based on slots (min height 100px)
                    const rowHeight = Math.max(100, (maxSlots * 22) + 30);

                    return (
                        <div key={weekIndex} className="calendar-week" style={{ height: `${rowHeight}px` }}>
                            <div className="week-bg">
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`calendar-day ${day.getMonth() !== currentDate.getMonth() ? 'other-month' : ''}`}
                                    >
                                        <span className="day-number">{day.getDate()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="week-content">
                                {promoWithSlots.map((promo) => (
                                    <div
                                        key={`${promo.id}-${weekIndex}`}
                                        className="promo-bar"
                                        style={{
                                            left: `${(promo.startDayIndex / 7) * 100}%`,
                                            width: `${(promo.span / 7) * 100}%`,
                                            top: `${promo.slotIndex * 22 + 25}px`, // 25px offset for date number
                                            backgroundColor: promo.color,
                                            borderRadius: `${promo.isStart ? '4px' : '0'} ${promo.isEnd ? '4px' : '0'} ${promo.isEnd ? '4px' : '0'} ${promo.isStart ? '4px' : '0'}`
                                        }}
                                        title={promo.name}
                                    >
                                        <span className="promo-name">{promo.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
