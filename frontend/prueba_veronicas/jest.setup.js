import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

// Global Mocks

// Mock Server Actions (Prevent loading server code)
jest.mock("@/actions/products.actions", () => ({
  createProductAction: jest.fn(),
  updateProductAction: jest.fn(),
  deleteProductAction: jest.fn(),
}));

jest.mock("@/lib/services/products.service", () => ({
  getProductById: jest.fn(),
  getProducts: jest.fn(),
}));


// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => "/test-path",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-intl (Fixes ESM export errors)
jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
  useLocale: () => "es",
}));

// Mock Sonner
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
