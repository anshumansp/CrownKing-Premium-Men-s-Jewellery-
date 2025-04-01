import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Placeholder function to get product data based on slug
// In a real app, this would fetch data from the backend API
const getProductData = (slug: string) => {
  // Simulate finding a product based on slug
  const productId = slug.split('-').pop(); // Extract ID from slug like 'mens-jewellery-item-1'
  return {
    id: `ck${productId}`,
    name: `Men's Jewellery Item ${productId}`,
    price: (Math.random() * 300 + 50).toFixed(2),
    imageUrl: `https://picsum.photos/seed/productpage${productId}/600/600`,
    description: `This is a detailed description for Men's Jewellery Item ${productId}. It highlights the craftsmanship, materials used, and unique design features. Perfect for adding a touch of elegance and style. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    slug: slug,
    category: 'Rings', // Example category
    material: 'Sterling Silver', // Example material
  };
};

interface ProductDetailPageProps {
  params: { slug: string };
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ params }) => {
  const { slug } = params;
  const product = getProductData(slug); // Fetch product data

  if (!product) {
    // Handle case where product is not found (e.g., show a 404 page)
    // For now, just return a simple message
    return <div>Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs (Optional) */}
      <div className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-brand-teal">Home</Link> /{' '}
        <Link href="/products" className="hover:text-brand-teal">Products</Link> /{' '}
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative h-96 md:h-[500px] bg-gray-200 rounded-lg shadow-md overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            priority // Prioritize loading the main product image
          />
          {/* Optional: Add image gallery thumbnails */}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-brand-dark-blue mb-3">
            {product.name}
          </h1>
          <p className="text-2xl text-brand-teal font-bold mb-5">${product.price}</p>

          {/* Short Description or Key Features */}
          <p className="text-gray-700 mb-6">
            {product.description.substring(0, 150)}... {/* Show partial description */}
          </p>

          {/* Attributes (Example) */}
          <div className="mb-6 space-y-2 text-sm text-gray-600">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Material:</strong> {product.material}</p>
            {/* Add other attributes like size, color options etc. */}
          </div>

          {/* Quantity Selector (Optional) */}
          {/* <div className="mb-6 flex items-center">
            <label htmlFor="quantity" className="mr-4 font-medium text-gray-700">Quantity:</label>
            <input type="number" id="quantity" name="quantity" min="1" defaultValue="1" className="w-16 p-2 border border-gray-300 rounded-md focus:ring-brand-teal focus:border-brand-teal" />
          </div> */}

          {/* Add to Cart Button */}
          <button className="w-full md:w-auto bg-brand-teal hover:bg-brand-dark-blue text-white font-semibold py-3 px-8 rounded-md transition duration-300 ease-in-out shadow-md">
            Add to Cart
          </button>

          {/* Full Description (Optional - could be in a separate section/tab) */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-brand-dark-blue mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Related Products Section (Optional) */}
      {/* <section className="mt-16">
        <h2 className="text-2xl font-semibold text-brand-dark-blue mb-6">You Might Also Like</h2>
        {/* Grid of related product cards */}
      {/* </section> */}
    </div>
  );
};

export default ProductDetailPage;
