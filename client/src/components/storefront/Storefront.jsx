import React, { useState, useEffect } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ProductCard from './ProductCard';
import CartSidebar from './CartSidebar';

const Storefront = () => {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock products data for demo
  const mockProducts = [
    {
      id: '1',
      name: 'Diamond Solitaire Ring',
      price: 2999,
      originalPrice: 3499,
      category: 'rings',
      material: 'White Gold',
      images: ['/api/placeholder/300/300'],
      rating: 4.9,
      reviewCount: 234,
      stock: 5,
      isSale: true
    },
    {
      id: '2',
      name: 'Pearl Drop Earrings',
      price: 299,
      category: 'earrings',
      material: 'Sterling Silver',
      images: ['/api/placeholder/300/300'],
      rating: 4.7,
      reviewCount: 89,
      stock: 12
    },
    {
      id: '3',
      name: 'Tennis Bracelet',
      price: 1899,
      originalPrice: 2299,
      category: 'bracelets',
      material: 'Platinum',
      images: ['/api/placeholder/300/300'],
      rating: 4.8,
      reviewCount: 156,
      stock: 3,
      isSale: true
    },
    {
      id: '4',
      name: 'Statement Necklace',
      price: 599,
      category: 'necklaces',
      material: 'Rose Gold',
      images: ['/api/placeholder/300/300'],
      rating: 4.6,
      reviewCount: 78,
      stock: 8
    },
    {
      id: '5',
      name: 'Vintage Watch',
      price: 3999,
      category: 'watches',
      material: 'Gold',
      images: ['/api/placeholder/300/300'],
      rating: 4.9,
      reviewCount: 345,
      stock: 2
    },
    {
      id: '6',
      name: 'Festival Collection Ring',
      price: 899,
      category: 'festival',
      material: 'Gold',
      images: ['/api/placeholder/300/300'],
      rating: 4.5,
      reviewCount: 67,
      stock: 15
    }
  ];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filteredProducts = currentCategory === 'all' 
          ? mockProducts 
          : mockProducts.filter(product => product.category === currentCategory);
        setProducts(filteredProducts);
        setLoading(false);
      }, 500);
    };
    
    loadProducts();
  }, [currentCategory]);

  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
  };

  const handleShopNow = () => {
    setCurrentCategory('all');
    // Scroll to products section
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDetails = (product) => {
    // In a real app, this would navigate to a product detail page
    alert(`Viewing details for: ${product.name}\nPrice: $${product.price}\nMaterial: ${product.material}`);
  };

  const getCategoryTitle = () => {
    const categoryNames = {
      all: 'All Jewelry',
      rings: 'Rings',
      necklaces: 'Necklaces',
      earrings: 'Earrings',
      bracelets: 'Bracelets',
      watches: 'Watches',
      festival: 'Festival Collection'
    };
    return categoryNames[currentCategory] || 'Products';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onCategorySelect={handleCategorySelect}
        currentCategory={currentCategory}
      />

      {/* Hero Section - only show on 'all' category */}
      {currentCategory === 'all' && (
        <HeroSection onShopNow={handleShopNow} />
      )}

      {/* Featured Categories - only show on 'all' category */}
      {currentCategory === 'all' && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { id: 'rings', name: 'Rings', icon: '💍' },
                { id: 'necklaces', name: 'Necklaces', icon: '📿' },
                { id: 'earrings', name: 'Earrings', icon: '👂' },
                { id: 'bracelets', name: 'Bracelets', icon: '📿' },
                { id: 'watches', name: 'Watches', icon: '⌚' },
                { id: 'festival', name: 'Festival', icon: '✨' }
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section id="products-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getCategoryTitle()}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our curated collection of exquisite jewelry pieces, 
              each crafted with the finest materials and attention to detail.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💎</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category or check back later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Be the first to know about new collections, exclusive offers, and jewelry tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <span className="text-purple-400">💎</span> Sparkle
              </h3>
              <p className="text-gray-400">
                Crafting timeless elegance since 1998. Your trusted partner for life's most precious moments.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Size Guide</a></li>
                <li><a href="#" className="hover:text-white">Care Instructions</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Live Chat</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">📘</a>
                <a href="#" className="text-gray-400 hover:text-white">📷</a>
                <a href="#" className="text-gray-400 hover:text-white">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white">📍</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sparkle Jewelry. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
};

export default Storefront;