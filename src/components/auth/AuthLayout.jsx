
import backgroundImage from "../../assets/imagecars.png";
import SocialLogin from "./SocialLogin";
import "../../styles/auth.css";

function AuthLayout({
  title,
  introTitle,
  description,
  children,
  footer,
  showSocial = true,
  variant = "",
}) {
  return (
    <main
      className="auth-page"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(255, 255, 255, 0.12),
            rgba(255, 255, 255, 0.12)
          ),
          url("${backgroundImage}")
        `,
      }}
    >
      <section
        className={`auth-panel ${
          variant ? `auth-panel--${variant}` : ""
        }`}
      >
        {/* Left Section */}
        <div className="auth-intro">
          <h1>{introTitle}</h1>
          <p>{description}</p>
        </div>

        {/* Right Section */}
        <div className="auth-form-section">
          <h2>{title}</h2>

          {children}

          {footer && (
            <p className="auth-footer">{footer}</p>
          )}
        </div>

        {/* Social Login */}
        {showSocial && <SocialLogin />}
      </section>
    </main>
  );
}

export default AuthLayout;
