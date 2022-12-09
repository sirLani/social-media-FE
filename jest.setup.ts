// jest.setup.ts
import "@testing-library/jest-dom";
import { server } from "./mocks/server";
// Establish API mocking before all tests.

// jest.mock("react-toastify", () => {
//   const actual = jest.requireActual("react-toastify");
//   Object.assign(actual, { toast: jest.fn() });
//   return actual;
// });

beforeAll(() =>
  server.listen({
    onUnhandledRequest: "bypass",
  })
);
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
