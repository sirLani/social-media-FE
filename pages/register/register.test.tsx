import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import Register from ".";
import { server } from "../../mocks/server";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      pathname: "",
      // ... whatever else you you call on `router`
    };
  },
}));

const setup = () => {
  render(<Register />);
};

describe("Register page", () => {
  describe("IMPLEMENTATION", () => {
    it("renders login header", () => {
      setup();
      const header = screen.queryByRole("heading", { name: /Register/i });
      expect(header).toBeInTheDocument();
    });
    it("has name input", () => {
      setup();
      const nameInput = screen.getByPlaceholderText(/Enter name/i);
      expect(nameInput).toBeInTheDocument();
    });
    it("has name label", () => {
      setup();
      const nameLabel = screen.getByLabelText(/Your name/i);
      expect(nameLabel).toBeInTheDocument();
    });
    it("has email input", () => {
      setup();
      const emailInput = screen.getByPlaceholderText(/Enter Email/i);
      expect(emailInput).toBeInTheDocument();
    });
    it("has email label", () => {
      setup();
      const emailLabel = screen.getByLabelText(/Email address/i);
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
    it("has password input", () => {
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

  describe("INTERACTIONS", () => {
    it("name input takes value when typed", async () => {
      setup();
      const nameInput = screen.getByPlaceholderText(
        /Enter name/i
      ) as HTMLInputElement;
      await userEvent.type(nameInput, "user");
      expect(nameInput).toHaveValue("user");
    });
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
    it("enables button when all inputs are filled", async () => {
      setup();
      const emailInput = screen.getByPlaceholderText(
        /Enter Email/i
      ) as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText(
        /Enter Password/i
      ) as HTMLInputElement;
      const nameInput = screen.getByPlaceholderText(
        /Enter name/i
      ) as HTMLInputElement;
      const secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      ) as HTMLInputElement;

      await userEvent.type(nameInput, "user");
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
      const nameInput = screen.getByPlaceholderText(
        /Enter name/i
      ) as HTMLInputElement;
      const secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      ) as HTMLInputElement;

      await userEvent.type(nameInput, "user");
      await userEvent.type(emailInput, "user@mail.com");
      await userEvent.type(passwordInput, "123456");
      await userEvent.type(secretInput, "red");
      const button = screen.queryByRole("button", {
        name: /Submit/i,
      }) as HTMLButtonElement;
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      await userEvent.click(button);
      await waitForElementToBeRemoved(screen.getByRole("status"));
    });
  });
  it("sends the details to the backend when the button is clicked", async () => {
    let reqBody;
    let count = 0;
    server.use(
      rest.post("/register", (req, res, ctx) => {
        reqBody = req.body;
        count += 1;
        return res(ctx.json({ success: true }));
      })
    );
    setup();
    const emailInput = screen.getByPlaceholderText(
      /Enter Email/i
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      /Enter Password/i
    ) as HTMLInputElement;
    const nameInput = screen.getByPlaceholderText(
      /Enter name/i
    ) as HTMLInputElement;
    const secretInput = screen.getByPlaceholderText(
      /Write your secret answer here/i
    ) as HTMLInputElement;

    await userEvent.type(nameInput, "user");
    await userEvent.type(emailInput, "user@mail.com");
    await userEvent.type(passwordInput, "123456");
    await userEvent.type(secretInput, "red");
    const button = screen.queryByRole("button", {
      name: /Submit/i,
    }) as HTMLButtonElement;
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.queryByRole("status")).toBeInTheDocument();
    expect(reqBody).toEqual({
      name: "user",
      email: "user@mail.com",
      password: "123456",
      secret: "red",
    });
  });
  it("disables the button when there is an api call", async () => {
    setup();
    const emailInput = screen.getByPlaceholderText(
      /Enter Email/i
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      /Enter Password/i
    ) as HTMLInputElement;
    const nameInput = screen.getByPlaceholderText(
      /Enter name/i
    ) as HTMLInputElement;
    const secretInput = screen.getByPlaceholderText(
      /Write your secret answer here/i
    ) as HTMLInputElement;

    await userEvent.type(nameInput, "user");
    await userEvent.type(emailInput, "user@mail.com");
    await userEvent.type(passwordInput, "123456");
    await userEvent.type(secretInput, "red");
    const button = screen.queryByRole("button", {
      name: /Submit/i,
    }) as HTMLButtonElement;
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(button).toBeDisabled();
  });
  it("displays modal when call is successful", async () => {
    setup();
    const emailInput = screen.getByPlaceholderText(
      /Enter Email/i
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      /Enter Password/i
    ) as HTMLInputElement;
    const nameInput = screen.getByPlaceholderText(
      /Enter name/i
    ) as HTMLInputElement;
    const secretInput = screen.getByPlaceholderText(
      /Write your secret answer here/i
    ) as HTMLInputElement;

    await userEvent.type(nameInput, "user");
    await userEvent.type(emailInput, "user@mail.com");
    await userEvent.type(passwordInput, "123456");
    await userEvent.type(secretInput, "red");
    const button = screen.queryByRole("button", {
      name: /Submit/i,
    }) as HTMLButtonElement;
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await userEvent.click(button);
    await waitFor(() => {
      expect(
        screen.queryByText(/You have successfully registered./i)
      ).toBeInTheDocument();
    });
  });
});
