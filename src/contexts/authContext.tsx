"use client";

import { createContext, useState, useEffect } from "react";
import * as NetlifyIdentityWidget from "netlify-identity-widget"
import { useRouter, usePathname } from "next/navigation";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false,
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    NetlifyIdentityWidget.on('init', user => {
      if (!user) {
        if (pathname !== '/') {
          router.push('/');
        }
        NetlifyIdentityWidget.open();
        // router.push('/');
      } else {
        if (pathname === '/') {
          router.push('/dashboard');
        }
      }
    });

    NetlifyIdentityWidget.on("login", (user) => {
      setUser(user);
      if (pathname === '/') {
        NetlifyIdentityWidget.close();
        router.push('/dashboard');
      }
    });

    // on logout
    NetlifyIdentityWidget.on("logout", (user) => {
      setUser(null);
      router.push('/');
      NetlifyIdentityWidget.open();
    });

    NetlifyIdentityWidget.init();
  }, []);

  const logout = () => {
    NetlifyIdentityWidget.logout();
  };

  const context = {
    logout,
    user,
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
