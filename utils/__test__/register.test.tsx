import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import Register from '../../pages/register';
import { server } from '../../mocks/server';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      // ... whatever else you you call on `router`
    };
  },
}));

const setup = () => {
  render(<Register />);
};

describe('Register page', () => {
  describe('IMPLEMENTATION', () => {
    it('renders login header', () => {
      setup();
      const header = screen.queryByRole('heading', { name: /Register/i });
      expect(header).toBeInTheDocument();
    });
    it('has name input', () => {
      setup();
      const nameInput = screen.getByPlaceholderText(/Enter name/i);
      expect(nameInput).toBeInTheDocument();
    });
    it('has name label', () => {
      setup();
      const nameLabel = screen.getByLabelText(/Your name/i);
      expect(nameLabel).toBeInTheDocument();
    });
    it('has email input', () => {
      setup();
      const emailInput = screen.getByPlaceholderText(/Enter Email/i);
      expect(emailInput).toBeInTheDocument();
    });
    it('has email label', () => {
      setup();
      const emailLabel = screen.getByLabelText(/Email address/i);
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
    it('has password input', () => {
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

  describe('INTERACTIONS', () => {
    let emailInput: HTMLInputElement,
      passwordInput: HTMLInputElement,
      nameInput: HTMLInputElement,
      secretInput: HTMLInputElement,
      button: HTMLButtonElement;
    const email = 'user@mail.com';
    const password = '123456';
    const name = 'user';
    const secret = 'red';
    const newSetup = async () => {
      setup();
      emailInput = screen.getByPlaceholderText(
        /Enter Email/i
      ) as HTMLInputElement;
      passwordInput = screen.getByPlaceholderText(
        /Enter Password/i
      ) as HTMLInputElement;
      nameInput = screen.getByPlaceholderText(
        /Enter name/i
      ) as HTMLInputElement;
      secretInput = screen.getByPlaceholderText(
        /Write your secret answer here/i
      ) as HTMLInputElement;

      await userEvent.type(nameInput, name);
      await userEvent.type(emailInput, email);
      await userEvent.type(passwordInput, password);
      await userEvent.type(secretInput, secret);
      button = screen.queryByRole('button', {
        name: /Submit/i,
      }) as HTMLButtonElement;
    };

    it('name input takes value when typed', async () => {
      setup();
      const nameInput = screen.getByPlaceholderText(
        /Enter name/i
      ) as HTMLInputElement;
      await userEvent.type(nameInput, name);
      expect(nameInput).toHaveValue(name);
    });
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
    it('enables button when all inputs are filled', async () => {
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
      await waitForElementToBeRemoved(screen.getByRole('status'));
    });
    it('sends the details to the backend when the button is clicked', async () => {
      let reqBody;
      let count = 0;
      server.use(
        rest.post('/register', (req, res, ctx) => {
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
        name: name,
        email: email,
        password: password,
        secret: secret,
      });
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
          screen.queryByText(/You have successfully registered./i)
        ).toBeInTheDocument();
      });
    });
  });
});
