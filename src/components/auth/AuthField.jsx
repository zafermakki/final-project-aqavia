
import { useState } from "react";
import AuthIcon from "./AuthIcon";

function AuthField({ icon, type = "text", ...inputProps }) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const inputType =
    isPassword && showPassword ? "text" : type;

  return (
    <div className="auth-input">
      <AuthIcon name={icon} size={13} />

      <input
        {...inputProps}
        type={inputType}
      />

      {isPassword && (
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((previous) => !previous)}
          aria-label={
            showPassword ? "Hide password" : "Show password"
          }
        >
          <AuthIcon
            name={showPassword ? "eyeOff" : "eye"}
            size={13}
          />
        </button>
      )}
    </div>
  );
}

export default AuthField;
