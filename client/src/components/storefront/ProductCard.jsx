import React from 'react';
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Mock data for demo
  const mockProduct = {
    id: Math.random().toString(36).substr(2, 9),
    name: product?.name || 'Diamond Engagement Ring',
    price: product?.price || 2999,
    originalPrice: product?.originalPrice || 3499,
    images: product?.images || ['/api/placeholder/300/300'],
    rating: product?.rating || 4.8,
    reviewCount: product?.reviewCount || 156,
    category: product?.category || 'rings',
    material: product?.material || 'Gold',
    isInStock: product?.stock > 0 || true,
    isSale: product?.isSale || false,
    ...product
  };

  const discount = mockProduct.originalPrice 
    ? Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
      onClick={() => onViewDetails(mockProduct)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
        <img
          src={mockProduct.images[0]}
          alt={mockProduct.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Sale Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          {isFavorite ? (
            <HeartIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartOutlineIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
          )}
        </button>

        {/* Stock Status */}
        {!mockProduct.isInStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Quick Add to Cart on Hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-4">
            <button
              onClick={handleAddToCart}
              disabled={!mockProduct.isInStock}
              className="w-full bg-white text-gray-900 py-2 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mockProduct.isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category & Material */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="capitalize">{mockProduct.category}</span>
          <span>{mockProduct.material}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {mockProduct.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(mockProduct.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {mockProduct.rating} ({mockProduct.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${mockProduct.price.toLocaleString()}
            </span>
            {mockProduct.originalPrice && mockProduct.originalPrice > mockProduct.price && (
              <span className="text-sm text-gray-500 line-through">
                ${mockProduct.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;