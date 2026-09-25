import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const showSwatToast = (msg, iconType) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: iconType,
      title: msg,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: "#172322",
      color: "#eef4f3",
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      const errMsg = "Please fill in all fields.";
      setError(errMsg);
      showSwatToast(errMsg, "error");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users_list")) || [];

    const validUser = existingUsers.find(
      (user) => user.email === email.trim() && user.password === password
    );

    if (!validUser) {
      const errMsg = "Invalid email or password.";
      setError(errMsg);
      showSwatToast(errMsg, "error");
      return;
    }

    localStorage.setItem("current_user", JSON.stringify(validUser));

    // رسالة نجاح تسجيل الدخول
    showSwatToast(`Welcome back, ${validUser.name}!`, "success");

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login 🍿</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-btn">Login</button>
        </form>

        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}