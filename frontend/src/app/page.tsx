import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center bg-gradient-to-br from-brand-teal-light via-brand-cream to-brand-blue-light p-8 rounded-lg shadow-lg mb-16">
        <div className="z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-brand-dark-blue mb-4">
            CrownKing Jewellery
          </h1>
          <p className="text-lg md:text-xl text-brand-dark-blue/90 mb-8">
            Exquisite Jewellery for the Modern Man
          </p>
          <Link
            href="/products"
            className="bg-brand-teal hover:bg-brand-dark-blue text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out shadow-md"
          >
            Shop Now
          </Link>
        </div>
        {/* Optional: Add a background image or overlay */}
        {/* <Image
          src="/path/to/hero-background.jpg" // Replace with an actual image URL/path
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-30"
        /> */}
      </section>

      {/* Featured Products Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-brand-dark-blue mb-8 text-center">
          Featured Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder Product Cards */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-brand-teal/30 rounded-lg shadow-md overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-60 bg-gray-200">
                {/* Placeholder for Product Image */}
                 <Image
                    src={`https://picsum.photos/seed/product${item}/400/300`} // Random placeholder image
                    alt={`Featured Product ${item}`}
                    layout="fill"
                    objectFit="cover"
                 />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-brand-dark-blue mb-2">
                  Product Name {item}
                </h3>
                <p className="text-brand-teal font-medium mb-4">$199.99</p>
                <Link
                  href={`/products/product-${item}`} // Placeholder link
                  className="text-brand-dark-blue hover:text-brand-teal font-medium"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action / About Section */}
      <section className="bg-brand-cream-dark p-12 rounded-lg shadow-inner text-center mb-16">
        <h2 className="text-3xl font-semibold text-brand-dark-blue mb-4">
          Discover Your Style
        </h2>
        <p className="text-brand-dark-blue/80 mb-6 max-w-2xl mx-auto">
          Explore our curated collections of rings, bracelets, necklaces, and more, designed to elevate your look.
        </p>
        <Link
          href="/about" // Placeholder link
          className="text-brand-teal hover:underline font-medium"
        >
          Learn More About CrownKing
        </Link>
      </section>
    </div>
  );
}
