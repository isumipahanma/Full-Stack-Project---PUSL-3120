import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../../ecommerce/components/ProductCard';

// Mock the CSS module
jest.mock('../../ecommerce/components/ProductCard.module.css', () => ({
  productCard: 'productCard',
  productImage: 'productImage',
  productInfo: 'productInfo',
  productName: 'productName',
  productPrice: 'productPrice',
  addToCartButton: 'addToCartButton'
}));

describe('ProductCard Component', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    description: 'A test product description',
    image: 'test-image.jpg',
    category: 'Electronics',
    stock: 10
  };

  const mockAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product information correctly', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        addToCart={mockAddToCart}
      />
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('A test product description')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  test('calls addToCart when button is clicked', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        addToCart={mockAddToCart}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });

  test('displays out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    
    render(
      <ProductCard 
        product={outOfStockProduct} 
        addToCart={mockAddToCart}
      />
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  test('disables add to cart button when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    
    render(
      <ProductCard 
        product={outOfStockProduct} 
        addToCart={mockAddToCart}
      />
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addToCartButton).toBeDisabled();
  });

  test('formats price correctly', () => {
    const productWithDecimal = { ...mockProduct, price: 149.5 };
    
    render(
      <ProductCard 
        product={productWithDecimal} 
        addToCart={mockAddToCart}
      />
    );

    expect(screen.getByText('$149.50')).toBeInTheDocument();
  });

  test('handles missing product image gracefully', () => {
    const productWithoutImage = { ...mockProduct, image: undefined };
    
    render(
      <ProductCard 
        product={productWithoutImage} 
        addToCart={mockAddToCart}
      />
    );

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
  });
});
