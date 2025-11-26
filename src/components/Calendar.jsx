import React from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isWithinInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = ({ currentDate, onDateChange, promotions }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const nextMonth = () => {
        onDateChange(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        onDateChange(subMonths(currentDate, 1));
    };

    return (
        <div className="calendar-container">
            <div className="header row flex-middle">
                <div className="col col-start">
                    <div className="icon" onClick={prevMonth}>
                        <ChevronLeft />
                    </div>
                </div>
                <div className="col col-center">
                    <span>{format(currentDate, "MMMM yyyy")}</span>
                </div>
                <div className="col col-end">
                    <div className="icon" onClick={nextMonth}>
                        <ChevronRight />
                    </div>
                </div>
            </div>

            <div className="days row">
                {weekDays.map((day) => (
                    <div className="col col-center" key={day}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="body">
                <div className="row wrap">
                    {days.map((day) => {
                        const dayPromotions = promotions.filter((promo) =>
                            isWithinInterval(day, {
                                start: promo.startDate,
                                end: promo.endDate,
                            })
                        );

                        return (
                            <div
                                className={`col cell ${!isSameMonth(day, monthStart)
                                        ? "disabled"
                                        : isSameDay(day, new Date())
                                            ? "selected"
                                            : ""
                                    }`}
                                key={day.toString()}
                            >
                                <span className="number">{format(day, dateFormat)}</span>
                                <div className="promotions">
                                    {dayPromotions.map((promo) => (
                                        <div
                                            key={promo.id}
                                            className="promotion-bar"
                                            style={{ backgroundColor: promo.color }}
                                            title={promo.name}
                                        >
                                            {promo.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
