let logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (fn: () => void) => {
  logoutHandler = fn;
};

export const callLogout = () => {
  if (!logoutHandler) {
    console.warn("Logout handler not set");
    return;
  }

  logoutHandler();
};
