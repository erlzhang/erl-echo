"use client";

import { createContext, useState, useEffect } from "react";
import * as NetlifyIdentityWidget from "netlify-identity-widget"
import { useRouter } from "next/navigation";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false,
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    NetlifyIdentityWidget.on('init', user => {
      console.log('user', user);
      if (!user) {
        if (router.pathname === '/') {
          NetlifyIdentityWidget.open();
        } else {
          router.push('/');
          NetlifyIdentityWidget.open();
        }
        // router.push('/');
      } else {
        if (router.pathname === '/') {
          router.push('/dashboard');
        }
      }
    });

    NetlifyIdentityWidget.on("login", (user) => {
      setUser(user);
      NetlifyIdentityWidget.close();
      router.push('/dashboard');
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