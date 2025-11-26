import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import PromotionForm from "./components/PromotionForm";
import MonthlyStats from "./components/MonthlyStats";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [promotions, setPromotions] = useState([]);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);

  // Fetch promotions from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "promotions"), orderBy("startDate"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const promos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Timestamps to Date objects
        startDate: doc.data().startDate.toDate(),
        endDate: doc.data().endDate.toDate(),
      }));
      setPromotions(promos);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAddPromotions = async (newPromotions) => {
    try {
      for (const promo of newPromotions) {
        if (editingPromotion) {
          // Update existing
          await updateDoc(doc(db, "promotions", editingPromotion.id), {
            name: promo.name,
            startDate: promo.startDate,
            endDate: promo.endDate,
            color: promo.color,
          });
          setEditingPromotion(null);
        } else {
          // Add new
          await addDoc(collection(db, "promotions"), {
            name: promo.name,
            startDate: promo.startDate,
            endDate: promo.endDate,
            color: promo.color,
            createdAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("Failed to save promotion");
    }
  };

  const handleDeletePromotion = async (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        await deleteDoc(doc(db, "promotions", id));
        if (editingPromotion && editingPromotion.id === id) {
          setEditingPromotion(null);
        }
      } catch (error) {
        console.error("Error deleting promotion:", error);
        alert("Failed to delete promotion");
      }
    }
  };

  const handleEditClick = (promo) => {
    setEditingPromotion(promo);
  };

  const handleCancelEdit = () => {
    setEditingPromotion(null);
  };

  if (!currentUser) {
    return isLoginView ? (
      <LoginPage onNavigateSignup={() => setIsLoginView(false)} />
    ) : (
      <SignupPage onNavigateLogin={() => setIsLoginView(true)} />
    );
  }

  return (
    <div className="app-container">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Promotion Scheduler</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{currentUser.email}</span>
          <button onClick={logout} style={{ padding: "5px 10px", cursor: "pointer" }}>Logout</button>
        </div>
      </header>
      <main>
        <div className="calendar-section">
          <MonthlyStats currentDate={currentDate} promotions={promotions} />
          <Calendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            promotions={promotions}
          />
        </div>
        <div className="sidebar">
          <PromotionForm
            onAddPromotions={handleAddPromotions}
            editingPromotion={editingPromotion}
            onCancelEdit={handleCancelEdit}
          />
          <div className="promotions-list">
            <h3>Upcoming Promotions</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {promotions.map((promo) => (
                <li
                  key={promo.id}
                  style={{
                    borderLeft: `4px solid ${promo.color}`,
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <strong>{promo.name}</strong>
                    <br />
                    <small>
                      {promo.startDate.toLocaleDateString()} -{" "}
                      {promo.endDate.toLocaleDateString()}
                    </small>
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => handleEditClick(promo)} style={{ fontSize: "0.8em", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDeletePromotion(promo.id)} style={{ fontSize: "0.8em", cursor: "pointer", color: "red" }}>Del</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
