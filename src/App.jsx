import React, { useState } from "react";
import Calendar from "./components/Calendar";
import PromotionForm from "./components/PromotionForm";
import { initialPromotions } from "./data";

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [promotions, setPromotions] = useState(initialPromotions);

  const handleAddPromotions = (newPromotions) => {
    setPromotions((prev) => [...prev, ...newPromotions]);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Promotion Scheduler</h1>
      </header>
      <main>
        <div className="calendar-section">
          <Calendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            promotions={promotions}
          />
        </div>
        <div className="sidebar">
          <PromotionForm onAddPromotions={handleAddPromotions} />
          <div className="promotions-list">
            <h3>Upcoming Promotions</h3>
            <ul>
              {[...promotions]
                .sort((a, b) => a.startDate - b.startDate)
                .map((promo) => (
                  <li key={promo.id} style={{ borderLeftColor: promo.color }}>
                    <strong>{promo.name}</strong>
                    <br />
                    <small>
                      {promo.startDate.toLocaleDateString()} -{" "}
                      {promo.endDate.toLocaleDateString()}
                    </small>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
