import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

import UserProvider from "../context";

const RootWrapper = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: RootWrapper, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
