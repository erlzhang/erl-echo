"use client";

import { createContext, useState, useEffect } from "react";
import { netlifyIdentity } from "netlify-identity-widget";
import { useRouter } from "next/router";

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
    netlifyIdentity.on('init', user => {
      console.log('user', user);
      if (!user) {
        router.push('/');
      }
    });

    netlifyIdentity.on("login", (user) => {
      setUser(user);
      netlifyIdentity.close();
    });

    // on logout
    netlifyIdentity.on("logout", (user) => {
      setUser(null);
    });

    netlifyIdentity.init();
  }, []);

  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;