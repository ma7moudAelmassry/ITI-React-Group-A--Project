import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Auth.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password && password === confirmPassword;

  
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

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      const errMsg = "Please fill in all fields.";
      setError(errMsg);
      showSwatToast(errMsg, "error");
      return;
    }

    if (name.trim().length < 2) {
      const errMsg = "Name must be at least 2 characters long.";
      setError(errMsg);
      showSwatToast(errMsg, "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errMsg = "Please enter a valid email address.";
      setError(errMsg);
      showSwatToast(errMsg, "error");
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      const errMsg = "Please meet all password requirements.";
      setError(errMsg);
      showSwatToast(errMsg, "error");
      return;
    }

    if (!passwordsMatch) {
      const errMsg = "Passwords do not match.";
      setError(errMsg);
      showSwatToast(errMsg, "error");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users_list")) || [];

    const userExists = existingUsers.some((user) => user.email === email);
    if (userExists) {
      const errMsg = "This email is already registered. Try logging in.";
      setError(errMsg);
      showSwatToast(errMsg, "error");
      return;
    }

    const newUser = { name: name.trim(), email: email.trim(), password };
    existingUsers.push(newUser);
    localStorage.setItem("users_list", JSON.stringify(existingUsers));
    localStorage.setItem("current_user", JSON.stringify(newUser));

    // رسالة نجاح التسجيل
    showSwatToast(`Registration successful! Welcome ${newUser.name}`, "success");

    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🎬</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your name"
            />
          </div>

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

          <ul className="password-checklist">
            <li className={hasMinLength ? "valid" : "invalid"}>
              {hasMinLength ? "✔" : "❌"} At least 6 characters
            </li>
            <li className={hasUppercase ? "valid" : "invalid"}>
              {hasUppercase ? "✔" : "❌"} At least one uppercase letter
            </li>
            <li className={hasNumber ? "valid" : "invalid"}>
              {hasNumber ? "✔" : "❌"} At least one number
            </li>
          </ul>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Re-enter your password"
            />
            {confirmPassword && (
              <div className={`match-status ${passwordsMatch ? "valid-text" : "invalid-text"}`}>
                {passwordsMatch ? "✔ Passwords match" : "❌ Passwords do not match"}
              </div>
            )}
          </div>

          <button type="submit" className="auth-btn">Register</button>
        </form>

        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}