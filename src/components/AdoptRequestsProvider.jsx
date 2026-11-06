"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { myAdoptRequests } from "@/lib/getUser"; // your lib file

/* Save as: src/components/AdoptRequestsProvider.jsx
   One shared list of "pets this user already requested", so the card and the
   details page always show the same button text. */

const AdoptRequestsContext = createContext({
  hasRequested: () => false,
  markRequested: () => {},
});

export function AdoptRequestsProvider({ children }) {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;
  const [ids, setIds] = useState([]);

  // load the user's pending requests from the database (also after a page reload)
  useEffect(() => {
    if (!email) {
      setIds([]);
      return;
    }
    let active = true;
    myAdoptRequests(email)
      .then((data) => active && setIds(Array.isArray(data) ? data.map(String) : []))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [email]);

  const markRequested = useCallback((petId) => {
    const id = String(petId);
    setIds((list) => (list.includes(id) ? list : [...list, id]));
  }, []);

  const value = useMemo(
    () => ({ hasRequested: (petId) => ids.includes(String(petId)), markRequested }),
    [ids, markRequested]
  );

  return <AdoptRequestsContext.Provider value={value}>{children}</AdoptRequestsContext.Provider>;
}

export const useAdoptRequests = () => useContext(AdoptRequestsContext);