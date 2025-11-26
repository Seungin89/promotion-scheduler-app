import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onNavigateSignup }) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            // App.jsx will handle redirect
        } catch (err) {
            setError("Failed to log in: " + err.message);
        }

        setLoading(false);
    }

    return (
        <div className="auth-container" style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h2>Log In</h2>
            {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Email</label>
                    <input type="email" ref={emailRef} required style={{ padding: "8px" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Password</label>
                    <input type="password" ref={passwordRef} required style={{ padding: "8px" }} />
                </div>
                <button disabled={loading} type="submit" style={{ padding: "10px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Log In
                </button>
            </form>
            <div style={{ marginTop: "10px", textAlign: "center" }}>
                Need an account? <button onClick={onNavigateSignup} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", textDecoration: "underline" }}>Sign Up</button>
            </div>
        </div>
    );
}
