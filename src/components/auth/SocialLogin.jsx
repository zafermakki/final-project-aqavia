
import AuthIcon from "./AuthIcon";

function SocialLogin() {
  return (
    <div className="auth-social">
      <div className="social-divider">
        <span className="divider-line" />
        <span className="divider-or">or</span>
        <span className="divider-line" />
      </div>

      <div className="social-icons">
        <button type="button" aria-label="Continue with Google">
          <AuthIcon name="google" size={17} />
        </button>

        <button type="button" aria-label="Continue with Instagram">
          <AuthIcon name="instagram" size={18} />
        </button>

        <button type="button" aria-label="Continue with Facebook">
          <AuthIcon name="facebook" size={17} />
        </button>
      </div>
    </div>
  );
}

export default SocialLogin;
