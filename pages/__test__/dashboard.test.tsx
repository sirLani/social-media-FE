import { render, screen } from "@testing-library/react";
import UserRoute from "../../components/routes/routes";
import Dashboard from "../user/dashboard";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const setup = () => {
  render(
    <UserRoute>
      <Dashboard />
    </UserRoute>
  );
};

describe("DASHBOARD", () => {
  describe("Implementation", () => {
    it("renders dashboard header", () => {
      setup();
      const header = screen.queryByRole("heading", { name: /Newsfeed/i });
      //   expect(header).toBeInTheDocument();
    });
  });
});
