import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from '../../ecommerce/components/Cart';

// Mock the CSS module
jest.mock('../../ecommerce/components/Cart.module.css', () => ({
  cart: 'cart',
  cartItem: 'cartItem',
  cartTotal: 'cartTotal',
  checkoutButton: 'checkoutButton',
  emptyCart: 'emptyCart'
}));

describe('Cart Component', () => {
  const mockCartItems = [
    {
      id: '1',
      name: 'Product 1',
      price: 99.99,
      quantity: 2,
      image: 'product1.jpg'
    },
    {
      id: '2',
      name: 'Product 2',
      price: 149.99,
      quantity: 1,
      image: 'product2.jpg'
    }
  ];

  const mockRemoveFromCart = jest.fn();
  const mockUpdateQuantity = jest.fn();
  const mockCheckout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders cart items correctly', () => {
    render(
      <Cart
        items={mockCartItems}
        removeFromCart={mockRemoveFromCart}
        updateQuantity={mockUpdateQuantity}
        checkout={mockCheckout}
      />
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toBeInTheDocument();
  });

  test('displays correct quantities', () => {
    render(
      <Cart
        items={mockCartItems}
        removeFromCart={mockRemoveFromCart}
        updateQuantity={mockUpdateQuantity}
        checkout={mockCheckout}
      />
    );

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  test('calculates total correctly', () => {
    render(
      <Cart
        items={mockCartItems}
        removeFromCart={mockRemoveFromCart}
        updateQuantity={mockUpdateQuantity}
        checkout={mockCheckout}
      />
    );

    // Total should be (99.99 * 2) + (149.99 * 1) = 349.97
    expect(screen.getByText('$349.97')).toBeInTheDocument();
  });

  test('calls removeFromCart when remove button is clicked', () => {
    render(
      <Cart
        items={mockCartItems}
        removeFromCart={mockRemoveFromCart}
        updateQuantity={mockUpdateQuantity}
        checkout={mockCheckout}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
  });

  test('calls updateQuantity when quantity changes', () => {
    render(
      <Cart
        items={mockCartItems}
        removeFromCart={mockRemoveFromCart}
        updateQuantity={mockUpdateQuantity}
        checkout={mockCheckout}
      />
    );

    const quantityInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(quantityInputs[0], { target: { value: '3' } });

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  test('calls checkout when checkout button is clicked', () => {
    render(
      <Cart
        items={mockCartItems}
        removeFromCart={mockRemoveFromCart}
        updateQuantity={mockUpdateQuantity}
        checkout={mockCheckout}
      />
    );

    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    fireEvent.click(checkoutButton);

    expect(mockCheckout).toHaveBeenCalled();
  });

  test('displays empty cart message when no items', () => {
    render(
      <Cart
        items={[]}
        removeFromCart={mockRemoveFromCart}
        updateQuantity={mockUpdateQuantity}
        checkout={mockCheckout}
      />
    );

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('disables checkout button when cart is empty', () => {
    render(
      <Cart
        items={[]}
        removeFromCart={mockRemoveFromCart}
        updateQuantity={mockUpdateQuantity}
        checkout={mockCheckout}
      />
    );

    const checkoutButton = screen.getByRole('button', { name: /checkout/i });
    expect(checkoutButton).toBeDisabled();
  });

  test('handles quantity validation', () => {
    render(
      <Cart
        items={mockCartItems}
        removeFromCart={mockRemoveFromCart}
        updateQuantity={mockUpdateQuantity}
        checkout={mockCheckout}
      />
    );

    const quantityInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(quantityInputs[0], { target: { value: '0' } });

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 0);
  });
});
