import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import ForgotPassword from '../../pages/forgot-password';
import { server } from '../../mocks/server';
import { rest } from 'msw';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      // ... whatever else you you call on `router`
    };
  },
}));

const setup = () => {
  render(<ForgotPassword />);
};

describe('Forgot password Page', () => {
  describe('Implementations', () => {
    it('renders login header', () => {
      setup();
      const header = screen.queryByRole('heading', {
        name: /Forgot Password/i,
      });
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
    it('has secret input', () => {
      setup();
      const secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      );
      expect(secretInput).toBeInTheDocument();
    });
    it('has secret label', () => {
      setup();
      const secretLabel = screen.getByLabelText(/Pick a question/i);
      expect(secretLabel).toBeInTheDocument();
    });
  });
  describe('Interactions', () => {
    let button: HTMLButtonElement;
    let emailInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;
    let secretInput: HTMLInputElement;
    const email = 'user@mail.com';
    const password = '123456';

    const secret = 'red';

    const newSetup = async () => {
      setup();
      emailInput = screen.getByPlaceholderText(
        /Enter Email/i
      ) as HTMLInputElement;
      passwordInput = screen.getByPlaceholderText(
        /Enter Password/i
      ) as HTMLInputElement;
      secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      ) as HTMLInputElement;
      await userEvent.type(emailInput, email);
      await userEvent.type(passwordInput, password);
      await userEvent.type(secretInput, secret);
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
    it('secret input takes value when typed', async () => {
      setup();
      const secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      ) as HTMLInputElement;
      await userEvent.type(secretInput, secret);
      expect(secretInput).toHaveValue(secret);
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
        rest.post('/forgot-password', (req, res, ctx) => {
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
        newPassword: password,
        secret: secret,
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
    it('displays modal when call is successful', async () => {
      await newSetup();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      await userEvent.click(button);
      await waitFor(() => {
        expect(
          screen.queryByText(
            /Congrats you can now login with your new password/i
          )
        ).toBeInTheDocument();
      });
    });

    it('sets the form to empty when it is successful', async () => {
      await newSetup();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      await userEvent.click(button);
      expect(emailInput).not.toHaveTextContent;
      expect(passwordInput).not.toHaveTextContent;
      expect(secretInput).not.toHaveTextContent;
    });
  });
});
