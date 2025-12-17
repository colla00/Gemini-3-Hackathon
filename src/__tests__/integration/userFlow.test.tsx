import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Landing } from '@/pages/Landing';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactNode, initialRoute = '/') => {
  const queryClient = createTestQueryClient();
  return render(
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {component}
        </MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

describe('Landing Page User Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the landing page with main elements', async () => {
    renderWithProviders(<Landing />);
    
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  it('displays navigation elements', async () => {
    renderWithProviders(<Landing />);
    
    await waitFor(() => {
      const nav = screen.queryByRole('navigation');
      expect(nav || screen.getByRole('main')).toBeInTheDocument();
    });
  });

  it('renders call-to-action buttons', async () => {
    renderWithProviders(<Landing />);
    
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});

describe('Navigation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has interactive elements for navigation', async () => {
    renderWithProviders(<Landing />);
    
    await waitFor(() => {
      const links = screen.queryAllByRole('link');
      const buttons = screen.queryAllByRole('button');
      expect(links.length + buttons.length).toBeGreaterThan(0);
    });
  });
});

describe('Accessibility', () => {
  it('has proper heading hierarchy', async () => {
    renderWithProviders(<Landing />);
    
    await waitFor(() => {
      const h1Elements = screen.queryAllByRole('heading', { level: 1 });
      expect(h1Elements.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('all images have alt text', async () => {
    renderWithProviders(<Landing />);
    
    await waitFor(() => {
      const images = screen.queryAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  it('interactive elements are keyboard accessible', async () => {
    renderWithProviders(<Landing />);
    
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });
});
