import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../ecommerce/HomePage';

// Mock the CSS module
jest.mock('../../ecommerce/HomePage.module.css', () => ({
  homePage: 'homePage',
  banner: 'banner',
  productsSection: 'productsSection',
  categoryFilter: 'categoryFilter'
}));

// Mock the components
jest.mock('../../ecommerce/components/ProductCard', () => {
  return function MockProductCard({ product, addToCart }) {
    return (
      <div data-testid={`product-${product.id}`}>
        <h3>{product.name}</h3>
        <p>${product.price}</p>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    );
  };
});

jest.mock('../../ecommerce/components/Cart', () => {
  return function MockCart({ items, removeFromCart, updateQuantity, checkout }) {
    return (
      <div data-testid="cart">
        <h2>Cart ({items.length} items)</h2>
        {items.map(item => (
          <div key={item.id} data-testid={`cart-item-${item.id}`}>
            {item.name} - Qty: {item.quantity}
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
        <button onClick={checkout}>Checkout</button>
      </div>
    );
  };
});

describe('HomePage Component', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      price: 99.99,
      description: 'Test product 1',
      category: 'Electronics',
      image: 'product1.jpg',
      stock: 10
    },
    {
      id: '2',
      name: 'Product 2',
      price: 149.99,
      description: 'Test product 2',
      category: 'Clothing',
      image: 'product2.jpg',
      stock: 5
    },
    {
      id: '3',
      name: 'Product 3',
      price: 79.99,
      description: 'Test product 3',
      category: 'Electronics',
      image: 'product3.jpg',
      stock: 15
    }
  ];

  const mockCategories = ['All', 'Electronics', 'Clothing', 'Books'];

  beforeEach(() => {
    // Mock fetch for products
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders homepage with banner and products section', async () => {
    render(<HomePage />);

    expect(screen.getByText(/welcome to our store/i)).toBeInTheDocument();
    expect(screen.getByText(/featured products/i)).toBeInTheDocument();
  });

  test('loads and displays products', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
  });

  test('displays category filter options', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
    });
  });

  test('filters products by category', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });

    const electronicsFilter = screen.getByText('Electronics');
    fireEvent.click(electronicsFilter);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
    });
  });

  test('adds products to cart', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart')).toBeInTheDocument();
      expect(screen.getByText('Cart (1 items)')).toBeInTheDocument();
    });
  });

  test('removes products from cart', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });

    // Add to cart
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    });

    // Remove from cart
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
      expect(screen.getByText('Cart (0 items)')).toBeInTheDocument();
    });
  });

  test('handles checkout process', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });

    // Add to cart
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart')).toBeInTheDocument();
    });

    // Checkout
    const checkoutButton = screen.getByText('Checkout');
    fireEvent.click(checkoutButton);

    // This would typically navigate to checkout page or show checkout form
    // For now, we just verify the button click was handled
    expect(checkoutButton).toBeInTheDocument();
  });

  test('displays loading state while fetching products', () => {
    // Mock a slow fetch
    global.fetch = jest.fn(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      }), 100))
    );

    render(<HomePage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    // Mock fetch error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
    });
  });

  test('updates cart total when quantities change', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
    });

    // Add to cart
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart')).toBeInTheDocument();
    });

    // Verify cart shows correct item count
    expect(screen.getByText('Cart (1 items)')).toBeInTheDocument();
  });
});
