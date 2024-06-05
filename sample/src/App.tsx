import { Destructor, PortalIn, usePortal } from '@-ft/react-portal';
import { PropsWithChildren, ReactNode } from 'react';

export function App() {
  return <MyPage />;
}

function MyPage({ children }: PropsWithChildren) {
  const { append, PortalOut } = usePortal();

  return (
    <Layout>
      <SomeOtherComponent>
        <MyComponent append={append} />
      </SomeOtherComponent>
      <PortalOut />
    </Layout>
  );
}

function Layout({ children }: PropsWithChildren) {
  return <div style={{ padding: 40, background: 'skyblue' }}>{children}</div>;
}

function SomeOtherComponent({ children }: PropsWithChildren) {
  return <div style={{ padding: 40, background: 'pink' }}>{children}</div>;
}

function MyComponent({ append }: { append: (node: ReactNode) => Destructor }) {
  return (
    <div style={{ padding: 10, background: 'white' }}>
      Here is MyComponent
      <PortalIn append={append}>
        <DirectBottomOfLayout />
      </PortalIn>
    </div>
  );
}

function DirectBottomOfLayout() {
  return '...and it is in MyComponent!';
}
