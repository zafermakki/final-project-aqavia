
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";

function Verification() {
  const navigate = useNavigate();
  const [code, setCode] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");

  const inputRefs = useRef([]);

  // Handle digit input and move to the next field
  const handleChange = (index, value) => {
    const digits = value.replace(/\D/g, "").slice(0, 6 - index);

    if (!digits) {
      if (value === "") {
        setCode((previous) => {
          const updated = [...previous];
          updated[index] = "";
          return updated;
        });
      }

      return;
    }

    setCode((previous) => {
      const updated = [...previous];

      digits.split("").forEach((digit, offset) => {
        updated[index + offset] = digit;
      });

      return updated;
    });

    setMessage("");

    const nextIndex = Math.min(index + digits.length, 5);

    inputRefs.current[nextIndex]?.focus();
  };

  // Handle Backspace and keyboard navigation
  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting a complete verification code
  const handlePaste = (event, index) => {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6 - index);

    if (!pastedDigits) return;

    setCode((previous) => {
      const updated = [...previous];

      pastedDigits.split("").forEach((digit, offset) => {
        updated[index + offset] = digit;
      });

      return updated;
    });

    setMessage("");

    const nextIndex = Math.min(index + pastedDigits.length, 5);

    inputRefs.current[nextIndex]?.focus();
  };

  // Verify the entered code
  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/login");
  };

  return (
    <AuthLayout
      title="Verification"
      introTitle="Verify Your Account"
      description="Enter the 6-digit code sent to your registered email or phone number."
      showSocial={false}
      variant="verification"
    >
      <form
        className="verification-form"
        onSubmit={handleSubmit}
      >
        {/* OTP Inputs */}
        <div className="verification-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={digit}
              placeholder="5"
              aria-label={`Verification digit ${index + 1}`}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              className="verification-input"
              onChange={(event) =>
                handleChange(index, event.target.value)
              }
              onKeyDown={(event) =>
                handleKeyDown(index, event)
              }
              onPaste={(event) =>
                handlePaste(event, index)
              }
            />
          ))}
        </div>

        {/* Feedback Message */}
        <p
          className="auth-message verification-message"
          aria-live="polite"
        >
          {message || "\u00a0"}
        </p>

        {/* Verify Button */}
        <button
          type="submit"
          className="auth-submit verification-submit"
        >
          Verify
        </button>
      </form>
    </AuthLayout>
  );
}

export default Verification;
