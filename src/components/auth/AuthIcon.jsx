
function AuthIcon({ name, size = 16 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "user":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
        </svg>
      );

    case "phone":
      return (
        <svg {...props}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.07 3h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L9.05 10.9a16 16 0 0 0 4.05 4.05l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7a2 2 0 0 1 1.72 1.99Z" />
        </svg>
      );

    case "lock":
      return (
        <svg {...props}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="15" r="1" />
          <path d="M12 16v2" />
        </svg>
      );

    case "eye":
      return (
        <svg {...props}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );

    case "eyeOff":
      return (
        <svg {...props}>
          <path d="m3 3 18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3 3.8" />
          <path d="M6.2 6.2A19 19 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4-.8" />
        </svg>
      );

    case "login":
      return (
        <svg {...props}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
        </svg>
      );

    case "google":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d="M21.35 12.2c0-.7-.06-1.4-.18-2.07H12v3.91h5.24a4.48 4.48 0 0 1-1.94 2.94v2.4h3.14c1.84-1.7 2.91-4.2 2.91-7.18ZM12 22c2.62 0 4.82-.87 6.43-2.35l-3.13-2.4c-.87.59-1.98.94-3.3.94-2.54 0-4.68-1.72-5.45-4.04H3.32v2.48A9.72 9.72 0 0 0 12 22ZM6.55 14.15a5.84 5.84 0 0 1 0-4.29V7.38H3.32a9.74 9.74 0 0 0 0 9.25l3.23-2.48ZM12 5.82c1.43 0 2.72.49 3.72 1.46l2.79-2.79C16.82 2.93 14.62 2 12 2a9.72 9.72 0 0 0-8.68 5.38l3.23 2.48C7.32 7.54 9.46 5.82 12 5.82Z" />
        </svg>
      );

    case "instagram":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="18" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      );

    case "facebook":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d="M24 12a12 12 0 1 0-13.88 11.86v-8.39H7.08V12h3.04V9.36c0-3 1.79-4.65 4.52-4.65 1.3 0 2.66.23 2.66.23v2.93h-1.5c-1.48 0-1.94.92-1.94 1.86V12h3.3l-.53 3.47h-2.77v8.39A12 12 0 0 0 24 12Z" />
        </svg>
      );

    default:
      return null;
  }
}

export default AuthIcon;
