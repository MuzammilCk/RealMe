import { Component, type ReactNode } from 'react';

interface Props {
  onError: () => void;
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

// If the WebGL canvas fails to initialize (blocked context, driver error),
// fall back to Layer B instead of crashing the whole app.
export default class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
