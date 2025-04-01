import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Placeholder product data (replace with actual data fetching)
const products = Array.from({ length: 12 }).map((_, i) => ({
  id: `ck${i + 1}`,
  name: `Men's Jewellery Item ${i + 1}`,
  price: (Math.random() * 300 + 50).toFixed(2), // Random price between 50 and 350
  imageUrl: `https://picsum.photos/seed/productpage${i + 1}/400/400`, // Random placeholder image
  slug: `mens-jewellery-item-${i + 1}`,
}));

const ProductsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-brand-dark-blue mb-8">
        All Products
      </h1>

      {/* Optional: Add Filters/Sorting options here */}
      {/* <div className="mb-8 flex justify-between items-center">
        <span>Filters Placeholder</span>
        <span>Sort By Placeholder</span>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="border border-brand-teal/30 rounded-lg shadow-md overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 group">
            <Link href={`/products/${product.slug}`}>
              <div className="relative h-64 bg-gray-200 group-hover:opacity-90 transition-opacity duration-300">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-brand-dark-blue mb-1 truncate group-hover:text-brand-teal">
                  {product.name}
                </h3>
                <p className="text-brand-teal font-semibold mb-3">${product.price}</p>
                <button className="w-full bg-brand-teal text-white py-2 rounded-md hover:bg-brand-dark-blue transition duration-300 text-sm font-medium">
                  Add to Cart
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Optional: Add Pagination here */}
      {/* <div className="mt-12 text-center">
        <span>Pagination Placeholder</span>
      </div> */}
    </div>
  );
};

export default ProductsPage;
