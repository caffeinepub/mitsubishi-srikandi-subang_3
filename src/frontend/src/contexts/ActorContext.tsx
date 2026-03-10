import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, createContext, useContext } from "react";
import { useEffect } from "react";
import type { backendInterface } from "../backend";
import { useActor } from "../hooks/useActor";

interface ActorContextValue {
  actor: backendInterface | null;
  actorFetching: boolean;
}

const ActorContext = createContext<ActorContextValue>({
  actor: null,
  actorFetching: true,
});

export function ActorProvider({ children }: { children: ReactNode }) {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  // Invalidate and refetch all data queries once when the actor first becomes ready.
  // This effect runs only here — not in every component that calls useActor().
  useEffect(() => {
    if (actor) {
      queryClient.invalidateQueries({
        predicate: (query) => !query.queryKey.includes("actor"),
      });
      queryClient.refetchQueries({
        predicate: (query) => !query.queryKey.includes("actor"),
      });
    }
  }, [actor, queryClient]);

  return (
    <ActorContext.Provider value={{ actor, actorFetching }}>
      {children}
    </ActorContext.Provider>
  );
}

export function useActorContext(): ActorContextValue {
  return useContext(ActorContext);
}
