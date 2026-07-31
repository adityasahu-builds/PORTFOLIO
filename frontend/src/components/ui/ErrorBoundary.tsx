"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Fallback UI when the boundary catches an error. Defaults to null (invisible). */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * ErrorBoundary
 * Wraps volatile components (WebGL Canvas, R3F scenes, dynamic imports)
 * to prevent 3D rendering crashes from breaking the full page.
 * Renders an invisible fallback by default so the layout stays intact.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in dev — replace with Sentry / monitoring in prod
    if (process.env.NODE_ENV !== "production") {
      console.warn("[ErrorBoundary] Caught error:", error.message, info);
    }
  }

  render() {
    if (this.state.hasError) {
      // Default: invisible fallback to preserve layout
      return this.props.fallback ?? (
        <div aria-hidden="true" style={{ display: "none" }} />
      );
    }
    return this.props.children;
  }
}
