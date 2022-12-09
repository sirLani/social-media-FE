import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import ForgotPassword from ".";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      pathname: "",
      // ... whatever else you you call on `router`
    };
  },
}));

const setup = () => {
  render(<ForgotPassword />);
};

describe("Forgot password Page", () => {
  describe("Implementations", () => {
    it("renders login header", () => {
      setup();
      const header = screen.queryByRole("heading", {
        name: /Forgot Password/i,
      });
      expect(header).toBeInTheDocument();
    });
    it("has email input", () => {
      setup();
      const emailInput = screen.getByPlaceholderText(/Enter Email/i);
      expect(emailInput).toBeInTheDocument();
    });
    it("has email label", () => {
      setup();
      const emailLabel = screen.getByLabelText(/Email/i);
      expect(emailLabel).toBeInTheDocument();
    });
    it("has password input", () => {
      setup();
      const passwordInput = screen.getByPlaceholderText(/Enter Password/i);
      expect(passwordInput).toBeInTheDocument();
    });
    it("has password label", () => {
      setup();
      const passwordLabel = screen.getByLabelText(/Password/i);
      expect(passwordLabel).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      setup();
      const passwordInput = screen.getByPlaceholderText(
        /Enter Password/i
      ) as HTMLInputElement;
      expect(passwordInput.type).toBe("password");
    });
    it("has secret input", () => {
      setup();
      const secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      );
      expect(secretInput).toBeInTheDocument();
    });
    it("has secret label", () => {
      setup();
      const secretLabel = screen.getByLabelText(/Pick a question/i);
      expect(secretLabel).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    it("email input takes value when typed", async () => {
      setup();
      const emailInput = screen.getByPlaceholderText(
        /Enter Email/i
      ) as HTMLInputElement;
      await userEvent.type(emailInput, "user@mail.com");
      expect(emailInput).toHaveValue("user@mail.com");
    });
    it("password input takes value when typed", async () => {
      setup();
      const passwordInput = screen.getByPlaceholderText(
        /Enter Password/i
      ) as HTMLInputElement;
      await userEvent.type(passwordInput, "123456");
      expect(passwordInput).toHaveValue("123456");
    });
    it("secret input takes value when typed", async () => {
      setup();
      const secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      ) as HTMLInputElement;
      await userEvent.type(secretInput, "red");
      expect(secretInput).toHaveValue("red");
    });

    it("disables button when email and password inputs are not filled", async () => {
      setup();
      const button = screen.queryByRole("button", {
        name: /Submit/i,
      }) as HTMLButtonElement;
      expect(button).toBeDisabled();
    });
    it("enables button when email and password inputs are filled", async () => {
      setup();
      const emailInput = screen.getByPlaceholderText(
        /Enter Email/i
      ) as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText(
        /Enter Password/i
      ) as HTMLInputElement;
      const secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      ) as HTMLInputElement;
      await userEvent.type(emailInput, "user@mail.com");
      await userEvent.type(passwordInput, "123456");
      await userEvent.type(secretInput, "red");
      const button = screen.queryByRole("button", {
        name: /Submit/i,
      }) as HTMLButtonElement;
      expect(button).toBeEnabled();
    });
    it("expect Spinner not to be in the document initially", async () => {
      setup();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    it("displays spinner while API in progress", async () => {
      setup();
      const emailInput = screen.getByPlaceholderText(
        /Enter Email/i
      ) as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText(
        /Enter Password/i
      ) as HTMLInputElement;
      const secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      ) as HTMLInputElement;

      await userEvent.type(emailInput, "user@mail.com");
      await userEvent.type(passwordInput, "123456");
      await userEvent.type(secretInput, "red");
      const button = screen.queryByRole("button", {
        name: /Submit/i,
      }) as HTMLButtonElement;
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      await userEvent.click(button);
      const loader = screen.getByRole("status");
      await waitForElementToBeRemoved(loader);
    });
  });
});
