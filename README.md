# `react-portal` - The real React Portal, not a ReactDOM Portal

Inject React node into any position in React tree.

## Usage

```jsx
import { usePortal, PortalIn } from '@-ft/react-portal';

function MyPage({ children }) {
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

function MyComponent({ append }) {
  return (
    <PortalIn append={append}>
      <DirectBottomOfLayout />
    </PortalIn>
  );
}
```
