import React from 'react';

const HeroSection = ({ onShopNow }) => {
  return (
    <section className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-pink-800 text-white">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Discover
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Timeless Elegance
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-purple-100 mb-8 leading-relaxed">
              Exquisite jewelry crafted with passion and precision. 
              From engagement rings to statement pieces, find your perfect sparkle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={onShopNow}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-full hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Shop Collection
              </button>
              
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300">
                View Lookbook
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-yellow-400">50K+</div>
                <div className="text-purple-200 text-sm">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-yellow-400">1000+</div>
                <div className="text-purple-200 text-sm">Unique Designs</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-yellow-400">25+</div>
                <div className="text-purple-200 text-sm">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Image/Visual Content */}
          <div className="relative">
            {/* Main jewelry image placeholder */}
            <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 rounded-full w-80 h-80 lg:w-96 lg:h-96 mx-auto shadow-2xl">
              <div className="absolute inset-4 bg-white rounded-full shadow-inner flex items-center justify-center">
                <div className="text-8xl lg:text-9xl">💎</div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-pink-500 text-white p-3 rounded-full animate-bounce">
                ✨
              </div>
              <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white p-3 rounded-full animate-pulse">
                👑
              </div>
              <div className="absolute top-1/4 -left-8 bg-yellow-400 text-white p-2 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}>
                💍
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-8 right-8 w-16 h-16 border-2 border-yellow-400 rounded-full opacity-60 animate-spin"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-2 border-pink-400 rounded-full opacity-60 animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 lg:h-16 fill-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;