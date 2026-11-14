
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthField from "../../components/auth/AuthField";
import AuthIcon from "../../components/auth/AuthIcon";

function SignUp() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    navigate("/verification");

  };

  return (
    <AuthLayout
      title="Sing up"
      introTitle="Let's Get Started!"
      description="Set up your account and take your delivery operations to the next level."
      footer={
        <>
          Already have an account?
          <Link to="/login"> Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="auth-fields">

          <AuthField
            icon="user"
            name="fullName"
            type="text"
            placeholder="Enter full name"
            aria-label="Full name"
            autoComplete="name"
            required
          />

          <AuthField
            icon="phone"
            name="phone"
            type="tel"
            placeholder="Enter number"
            aria-label="Phone number"
            autoComplete="tel"
            required
          />

          <AuthField
            icon="lock"
            name="password"
            type="password"
            placeholder="Enter password"
            aria-label="Password"
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <AuthField
            icon="lock"
            name="confirmPassword"
            type="password"
            placeholder="Enter password"
            aria-label="Confirm password"
            autoComplete="new-password"
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

        </div>

        <p className="auth-message" aria-live="polite">
          {message}
        </p>

        <button type="submit" className="auth-submit">
          <AuthIcon name="login" size={13} />
          <span>Sing up</span>
        </button>
      </form>
    </AuthLayout>
  );
}

export default SignUp;
