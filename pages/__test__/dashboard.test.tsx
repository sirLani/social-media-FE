import { render, screen, waitFor } from '../../helpers/test-utils';
import Dashboard from '../user/dashboard';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const setup = () => {
  render(<Dashboard />);
};

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe('DASHBOARD', () => {
  describe('Implementation', () => {
    it('renders dashboard header', () => {
      setup();
      const header = screen.queryByRole('heading', { name: /Newsfeed/i });
      expect(header).toBeInTheDocument();
    });

    it('renders textbox on the screen', () => {
      setup();
      const textbox = screen.getByRole('textbox');
      expect(textbox).toBeInTheDocument();
    });
    it('textbox can type words', async () => {
      setup();
      const textbox = screen.getByRole('textbox') as HTMLTextAreaElement;
      await userEvent.type(textbox, 'This is an example of the text that is');
      expect(textbox).toHaveValue('This is an example of the text that is');
    });

    it('displays user comment on page load', async () => {
      setup();
      await waitFor(() => {
        expect(screen.findByText(/another thing wey i know know/i));
      });
    });

    it('displays card name on page load', async () => {
      setup();
      await waitFor(() => {
        expect(screen.findByText(/Aston Villa/i));
      });
    });
  });
});
