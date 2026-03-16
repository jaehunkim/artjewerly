import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Mock next-intl
const mockUseLocale = vi.fn();
vi.mock('next-intl', () => ({
  useLocale: () => mockUseLocale(),
}));

// Mock the i18n routing module which wraps next/navigation
const mockReplace = vi.fn();
const mockUsePathname = vi.fn();
vi.mock('@/lib/i18n/routing', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: mockReplace }),
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockUsePathname.mockReturnValue('/');
  });

  it('renders "EN" label when current locale is "ko"', () => {
    mockUseLocale.mockReturnValue('ko');
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
  });

  it('renders "KR" label when current locale is "en"', () => {
    mockUseLocale.mockReturnValue('en');
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: 'KR' })).toBeInTheDocument();
  });

  it('calls router.replace with "en" locale when toggling from "ko"', () => {
    mockUseLocale.mockReturnValue('ko');
    mockUsePathname.mockReturnValue('/');
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'en' });
  });

  it('calls router.replace with "ko" locale when toggling from "en"', () => {
    mockUseLocale.mockReturnValue('en');
    mockUsePathname.mockReturnValue('/shop');
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockReplace).toHaveBeenCalledWith('/shop', { locale: 'ko' });
  });
});
