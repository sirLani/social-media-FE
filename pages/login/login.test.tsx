import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import Login from ".";
import userEvent from "@testing-library/user-event";
import { server } from "../../mocks/server";
import { rest } from "msw";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      pathname: "",
      // ... whatever else you you call on `router`
    };
  },
}));

const setup = () => {
  render(<Login />);
};

describe("Login", () => {
  describe("implementation", () => {
    it("renders login header", () => {
      setup();
      const header = screen.queryByRole("heading", { name: /Log In/i });
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
    it("has a button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Submit" });
      expect(button).toBeInTheDocument();
    });
    it("has register link", () => {
      setup();
      expect(screen.getByRole("link", { name: /Register/i })).toHaveAttribute(
        "href",
        "/register"
      );
    });

    it("has forgot password link", () => {
      setup();
      expect(
        screen.getByRole("link", { name: /Forgot password/i })
      ).toHaveAttribute("href", "/forgot-password");
    });
  });
});

describe("Login Interactions", () => {
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
    await userEvent.type(emailInput, "user@mail.com");
    await userEvent.type(passwordInput, "123456");
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
    await userEvent.type(emailInput, "user@mail.com");
    await userEvent.type(passwordInput, "123456");
    const button = screen.queryByRole("button", {
      name: /Submit/i,
    }) as HTMLButtonElement;
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.queryByRole("status")).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.getByRole("status"));
  });

  it("sends the details to the backend when the button is clicked", async () => {
    let reqBody;
    let count = 0;
    server.use(
      rest.post("/login", (req, res, ctx) => {
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
    await userEvent.type(emailInput, "user@mail.com");
    await userEvent.type(passwordInput, "123456");
    const button = screen.queryByRole("button", {
      name: /Submit/i,
    }) as HTMLButtonElement;
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.queryByRole("status")).toBeInTheDocument();
    expect(reqBody).toEqual({
      email: "user@mail.com",
      password: "123456",
    });
    // it calls the function just once
    expect(count).toEqual(1);
  });
  it("disables the button when there is an api call", async () => {
    setup();
    const emailInput = screen.getByPlaceholderText(
      /Enter Email/i
    ) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(
      /Enter Password/i
    ) as HTMLInputElement;
    await userEvent.type(emailInput, "user@mail.com");
    await userEvent.type(passwordInput, "123456");
    const button = screen.queryByRole("button", {
      name: /Submit/i,
    }) as HTMLButtonElement;
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(button).toBeDisabled();
  });
  // it("displays authentication fail message", async () => {
  //   server.use(
  //     rest.post("/login", (req, res, ctx) => {
  //       return res(
  //         ctx.status(400),
  //         ctx.json({ message: "Incorrect credentials" })
  //       );
  //     })
  //   );
  //   setup();
  //   const emailInput = screen.getByPlaceholderText(
  //     /Enter Email/i
  //   ) as HTMLInputElement;
  //   const passwordInput = screen.getByPlaceholderText(
  //     /Enter Password/i
  //   ) as HTMLInputElement;
  //   await userEvent.type(emailInput, "user56@mail.com");
  //   await userEvent.type(passwordInput, "123456");
  //   const button = screen.queryByRole("button", {
  //     name: /Submit/i,
  //   }) as HTMLButtonElement;
  //   expect(screen.queryByRole("status")).not.toBeInTheDocument();
  //   await userEvent.click(button);
  //   await waitFor(() => {
  //     expect(screen.findByText(/Incorrect credentials/i)).toBeInTheDocument();
  //   });
  // });
});
