import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import Login from '../../pages/login';
import userEvent from '@testing-library/user-event';
import { server } from '../../mocks/server';
import { rest } from 'msw';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const setup = () => {
  render(<Login />);
};
describe('Login', () => {
  describe('implementation', () => {
    it('renders login header', () => {
      setup();
      const header = screen.queryByRole('heading', { name: /Log In/i });
      expect(header).toBeInTheDocument();
    });
    it('has email input', () => {
      setup();
      const emailInput = screen.getByPlaceholderText(/Enter Email/i);
      expect(emailInput).toBeInTheDocument();
    });
    it('has email label', () => {
      setup();
      const emailLabel = screen.getByLabelText(/Email/i);
      expect(emailLabel).toBeInTheDocument();
    });
    it('has password input', () => {
      setup();
      const passwordInput = screen.getByPlaceholderText(/Enter Password/i);
      expect(passwordInput).toBeInTheDocument();
    });
    it('has password label', () => {
      setup();
      const passwordLabel = screen.getByLabelText(/Password/i);
      expect(passwordLabel).toBeInTheDocument();
    });
    it('has password type for password input', () => {
      setup();
      const passwordInput = screen.getByPlaceholderText(
        /Enter Password/i
      ) as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });
    it('has a button', () => {
      setup();
      const button = screen.queryByRole('button', { name: 'Submit' });
      expect(button).toBeInTheDocument();
    });
    it('has register link', () => {
      setup();
      expect(screen.getByRole('link', { name: /Register/i })).toHaveAttribute(
        'href',
        '/register'
      );
    });

    it('has forgot password link', () => {
      setup();
      expect(
        screen.getByRole('link', { name: /Forgot password/i })
      ).toHaveAttribute('href', '/forgot-password');
    });
  });
});

describe('Login Interactions', () => {
  const mockRouter = {
    push: jest.fn(), // the component uses `router.push` only
  };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  let button: HTMLButtonElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;

  const email = 'user@mail.com';
  const password = '123456';

  const newSetup = async () => {
    setup();
    emailInput = screen.getByPlaceholderText(
      /Enter Email/i
    ) as HTMLInputElement;
    passwordInput = screen.getByPlaceholderText(
      /Enter Password/i
    ) as HTMLInputElement;
    await userEvent.type(emailInput, email);
    await userEvent.type(passwordInput, password);
    button = screen.queryByRole('button', {
      name: /Submit/i,
    }) as HTMLButtonElement;
  };

  it('email input takes value when typed', async () => {
    setup();
    const emailInput = screen.getByPlaceholderText(
      /Enter Email/i
    ) as HTMLInputElement;
    await userEvent.type(emailInput, email);
    expect(emailInput).toHaveValue(email);
  });

  it('password input takes value when typed', async () => {
    setup();
    const passwordInput = screen.getByPlaceholderText(
      /Enter Password/i
    ) as HTMLInputElement;
    await userEvent.type(passwordInput, password);
    expect(passwordInput).toHaveValue(password);
  });

  it('disables button when email and password inputs are not filled', async () => {
    setup();
    const button = screen.queryByRole('button', {
      name: /Submit/i,
    }) as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it('enables button when email and password inputs are filled', async () => {
    await newSetup();
    expect(button).toBeEnabled();
  });
  it('expect Spinner not to be in the document initially', async () => {
    setup();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('displays spinner while API in progress', async () => {
    await newSetup();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.queryByRole('status')).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.getByRole('status'));
  });

  it('sends the details to the backend when the button is clicked', async () => {
    let reqBody;
    let count = 0;
    server.use(
      rest.post('/login', (req, res, ctx) => {
        reqBody = req.body;
        count += 1;
        return res(ctx.json({ success: true }));
      })
    );
    await newSetup();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.queryByRole('status')).toBeInTheDocument();
    expect(reqBody).toEqual({
      email: email,
      password: password,
    });
    // it calls the function just once
    expect(count).toEqual(1);
  });
  it('disables the button when there is an api call', async () => {
    await newSetup();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(button).toBeDisabled();
  });

  it('calls the redirect function when login is successful', async () => {
    await newSetup();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.queryByRole('status')).toBeInTheDocument();
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
  // it.only("displays authentication fail message", async () => {
  //   server.use(
  //     rest.post("/login", async (req, res, ctx) => {
  //       const { email } = await req.json();

  //       return res(
  //         ctx.status(500),
  //         ctx.json({ error: "Incorrect credentials" })
  //       );
  //     })
  //   );

  // await newSetup();
  //   expect(screen.queryByRole("status")).not.toBeInTheDocument();
  //   await userEvent.click(button);
  //   await waitFor(() => {
  //     expect(screen.findByText(/Incorrect credentials/i)).toBeInTheDocument();
  //   });
  // });
});
