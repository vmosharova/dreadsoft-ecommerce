import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
  category: 'electronics',
  description: 'This is a test product description',
  rating: { rate: 4.5, count: 100 },
  isOutOfStock: false
};

const defaultProps = {
  product: mockProduct,
  onClose: jest.fn(),
  addProduct: jest.fn()
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders without crashing', () => {
      render(<ProductCard {...defaultProps} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    test('displays product information correctly', () => {
      render(<ProductCard {...defaultProps} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('electronics')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', mockProduct.image);
      expect(screen.getByRole('img')).toHaveAttribute('alt', mockProduct.title);
    });

    test('shows product description (truncated)', () => {
      render(<ProductCard {...defaultProps} />);
      
      const description = screen.getByText(/This is a test product description/);
      expect(description).toBeInTheDocument();
    });

    test('displays rating stars and count', () => {
      render(<ProductCard {...defaultProps} />);
      
      expect(screen.getByText(/4.5/)).toBeInTheDocument();
      expect(screen.getByText(/100 reviews/)).toBeInTheDocument();
    });

    test('renders size variant dropdown', () => {
      render(<ProductCard {...defaultProps} />);
      
      expect(screen.getByText('Size Variant:')).toBeInTheDocument();
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Select size')).toBeInTheDocument();
    });

    test('renders quantity selector', () => {
      render(<ProductCard {...defaultProps} />);
      
      expect(screen.getByText('Quantity:')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
    });

    test('shows Add to Cart button with correct price', () => {
      render(<ProductCard {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /add to cart - \$29.99/i })).toBeInTheDocument();
    });
  });

  describe('State Management Tests', () => {
    test('initially has no variant selected', () => {
      render(<ProductCard {...defaultProps} />);
      
      const select = screen.getByRole('combobox');
      expect(select.value).toBe('');
    });

    test('updates selectedVariant when dropdown changes', async () => {
      render(<ProductCard {...defaultProps} />);
      
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'Large');
      
      expect(select.value).toBe('Large');
    });

    test('shows validation message when no variant selected', () => {
      render(<ProductCard {...defaultProps} />);
      
      expect(screen.getByText('Please select a size variant.')).toBeInTheDocument();
    });

    test('hides validation message when variant is selected', async () => {
      render(<ProductCard {...defaultProps} />);
      
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'Medium');
      
      await waitFor(() => {
        expect(screen.queryByText('Please select a size variant.')).not.toBeInTheDocument();
      });
    });

    test('disables - button when quantity is 1', () => {
      render(<ProductCard {...defaultProps} />);
      
      const minusButton = screen.getByRole('button', { name: '-' });
      expect(minusButton).toBeDisabled();
    });
  });

  describe('User Interaction Tests', () => {
    test('calls addProduct when Add to Cart clicked with variant selected', async () => {
      render(<ProductCard {...defaultProps} />);
      
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'Large');
      
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      await userEvent.click(addToCartButton);
      
      expect(defaultProps.addProduct).toHaveBeenCalledWith({
        ...mockProduct,
        variant: 'Large',
        quantity: 1
      });
    });

    test('does not call addProduct when no variant selected', async () => {
      render(<ProductCard {...defaultProps} />);
      
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      
      // Button should be disabled when no variant is selected
      expect(addToCartButton).toBeDisabled();
      
      await userEvent.click(addToCartButton);
      expect(defaultProps.addProduct).not.toHaveBeenCalled();
    });

    test('calls onClose when close button clicked', async () => {
      render(<ProductCard {...defaultProps} />);
      
      const closeButton = screen.getByLabelText('Close');
      await userEvent.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    test('quantity buttons work properly', async () => {
      render(<ProductCard {...defaultProps} />);
      
      const plusButton = screen.getByRole('button', { name: '+' });
      const minusButton = screen.getByRole('button', { name: '-' });
      
      // Increase quantity multiple times
      await userEvent.click(plusButton);
      await userEvent.click(plusButton);
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // Decrease quantity
      await userEvent.click(minusButton);
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Out of Stock Tests', () => {
    test('shows Add to Cart button when in stock', () => {
      render(<ProductCard {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
      expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument();
    });

    test('shows Out of Stock button when product is out of stock', () => {
      const outOfStockProduct = { ...mockProduct, isOutOfStock: true };
      render(<ProductCard {...defaultProps} product={outOfStockProduct} />);
      
      expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add to cart/i })).not.toBeInTheDocument();
    });

    test('disables all interactive elements when out of stock', () => {
      const outOfStockProduct = { ...mockProduct, isOutOfStock: true };
      render(<ProductCard {...defaultProps} product={outOfStockProduct} />);
      
      const select = screen.getByRole('combobox');
      const plusButton = screen.getByRole('button', { name: '+' });
      const minusButton = screen.getByRole('button', { name: '-' });
      const outOfStockButton = screen.getByRole('button', { name: 'Out of Stock' });
      
      expect(select).toBeDisabled();
      expect(plusButton).toBeDisabled();
      expect(minusButton).toBeDisabled();
      expect(outOfStockButton).toBeDisabled();
    });
  });

  describe('Integration Tests', () => {
    test('includes selected variant and quantity in cart item', async () => {
      render(<ProductCard {...defaultProps} />);
      
      // Select variant and increase quantity
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'XL');
      
      const plusButton = screen.getByRole('button', { name: '+' });
      await userEvent.click(plusButton);
      await userEvent.click(plusButton); // quantity = 3
      
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      await userEvent.click(addToCartButton);
      
      expect(defaultProps.addProduct).toHaveBeenCalledWith({
        ...mockProduct,
        variant: 'XL',
        quantity: 3
      });
    });

    test('calculates total price correctly', async () => {
      render(<ProductCard {...defaultProps} />);
      
      const plusButton = screen.getByRole('button', { name: '+' });
      await userEvent.click(plusButton); // quantity = 2
      
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'Medium');
      
      await waitFor(() => {
        expect(screen.getByText(/Add to Cart - \$59.98/)).toBeInTheDocument(); // 29.99 * 2
      });
    });

  });

});