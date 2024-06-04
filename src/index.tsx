import { WatchTarget } from '@-ft/watch-target';
import { useLayoutWatchTarget, useWatchValue } from '@-ft/watch-target-react';
import {
  ComponentType,
  Fragment,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Destructor = () => void; // name from @types/node

export interface Portal {
  append: (node: ReactNode) => Destructor;
  prepend: (node: ReactNode) => Destructor;
  PortalOut: ComponentType;
  count: number;
}

interface InternalStateNode {
  node: ReactNode;
  key: ReactNode;
}

interface InternalState {
  nodes: InternalStateNode[];
  end: number;
  count: number;
}

const initialState: InternalState = { nodes: [], end: 0, count: 0 };

function commonClear(
  updateState: (
    update: (previousState: InternalState) => InternalState
  ) => void,
  key: ReactNode
) {
  updateState(({ nodes, end, count }) => ({
    nodes: nodes.filter((node) => node.key !== key),
    end,
    count: count - 1,
  }));
}

function commonAppend(
  updateState: (
    update: (previousState: InternalState) => InternalState
  ) => void,
  node: ReactNode
) {
  const key = <>{node}</>; // to prevent incorrect removal due to same reference
  updateState(({ nodes, end, count }) => ({
    nodes: [...nodes, { node: <Fragment key={end}>{key}</Fragment>, key }],
    end: end + 1,
    count: count + 1,
  }));
  return () => commonClear(updateState, key);
}

function commonPrepend(
  updateState: (
    update: (previousState: InternalState) => InternalState
  ) => void,
  node: ReactNode
) {
  const key = <>{node}</>; // to prevent incorrect removal due to same reference
  updateState(({ nodes, end, count }) => ({
    nodes: [{ node: <Fragment key={end}>{key}</Fragment>, key }, ...nodes],
    end: end + 1,
    count: count + 1,
  }));
  return () => commonClear(updateState, key);
}

export function usePortal(): Portal {
  const [state, setState] = useState<InternalState>(initialState);

  const append = useCallback(
    (node: ReactNode) => commonAppend(setState, node),
    [setState]
  );
  const prepend = useCallback(
    (node: ReactNode) => commonPrepend(setState, node),
    [setState]
  );
  const inner = useLayoutWatchTarget(
    useMemo(() => state.nodes.map(({ node }) => node), [state])
  );
  const PortalOut = useCallback(
    function PortalOut() {
      return <>{useWatchValue(inner.watch)}</>;
    },
    [inner]
  );

  const { count } = state;
  return useMemo(
    () => ({ append, prepend, count, PortalOut }),
    [append, prepend, count, PortalOut]
  );
}

export interface PortalInProps extends PropsWithChildren {
  append: (node: ReactNode) => void;
}

export function PortalIn({ children, append }: PortalInProps) {
  const childrenWatchTarget = useLayoutWatchTarget(children);
  useEffect(() => append(watchToNode(childrenWatchTarget.watch)), [append]);
  return null;
}

function watchToNode(childrenWatchTarget: WatchTarget<ReactNode>['watch']) {
  function Component() {
    return <>{useWatchValue(childrenWatchTarget)}</>;
  }

  return <Component />;
}
