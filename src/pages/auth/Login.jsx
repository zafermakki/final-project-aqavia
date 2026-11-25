
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthField from "../../components/auth/AuthField";
import AuthIcon from "../../components/auth/AuthIcon";

function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/dashboard");
  };

  return (
    <AuthLayout
      title="Log in"
      introTitle="Good to Have You Back!"
      description="Log in and keep your business moving."
      footer={
        <>
          Don't have an account?
          <Link to="/signup"> Sign up</Link>
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
            autoComplete="username"
          />

          <AuthField
            icon="lock"
            name="password"
            type="password"
            placeholder="Enter password"
            aria-label="Password"
            autoComplete="current-password"
          />

        </div>

        <p className="auth-message" aria-live="polite">
          {message}
        </p>

        <button type="submit" className="auth-submit">
          <AuthIcon name="login" size={13} />
          <span>Log in</span>
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
