import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { App } from './app';
import { useAppInitialization } from './custom-hooks/use-app-initialization';
import '@testing-library/jest-dom/vitest';
import { useHtmlLang } from './custom-hooks/use-html-lang';

vi.mock('./custom-hooks/use-app-initialization', () => ({
  useAppInitialization: vi.fn(),
}));

vi.mock('./custom-hooks/use-html-lang', () => ({
  useHtmlLang: vi.fn(),
}));

vi.mock('./routes/main', () => ({ Main: () => <div data-testid="main-route" /> }));
vi.mock('./routes/start-page/start-page', () => ({ StartPage: () => <div data-testid="start-page" /> }));
vi.mock('./analytics-tracker', () => ({ AnalyticsTracker: () => null }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state when isLoading is true', () => {
    vi.mocked(useAppInitialization).mockReturnValue({
      isLoading: true,
      hasInitData: false,
    });

    render(<App />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('should render StartPage when loading is finished but no data exists', () => {
    vi.mocked(useAppInitialization).mockReturnValue({
      isLoading: false,
      hasInitData: false,
    });

    render(<App />);
    expect(screen.getByTestId('start-page')).toBeInTheDocument();
  });

  it('should render Main route when data is initialized', () => {
    vi.mocked(useAppInitialization).mockReturnValue({
      isLoading: false,
      hasInitData: true,
    });

    render(<App />);
    expect(screen.getByTestId('main-route')).toBeInTheDocument();
  });
});
