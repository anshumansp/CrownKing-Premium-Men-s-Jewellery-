'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function BlogPage() {
    const featuredPost = {
        id: 'care-guide',
        title: "The Ultimate Men's Jewelry Care Guide",
        excerpt: 'Discover essential tips for maintaining the brilliance and longevity of your precious metal and gemstone jewelry pieces.',
        date: 'March 28, 2024',
        author: 'Alexander Wright',
        authorRole: 'Jewelry Expert',
        category: 'Care & Maintenance',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        slug: '/blog/care-guide'
    };

    const recentPosts = [
        {
            id: 'styling-tips',
            title: 'How to Style Bracelets with Your Formal Attire',
            excerpt: 'Elevate your formal look with these expert styling tips for incorporating bracelets into your professional wardrobe.',
            date: 'March 15, 2024',
            category: 'Style Guide',
            readTime: '5 min read',
            image: 'https://images.pexels.com/photos/1472334/pexels-photo-1472334.jpeg?auto=compress&cs=tinysrgb&w=600',
            slug: '/blog/styling-tips'
        },
        {
            id: 'diamond-guide',
            title: "A Gentleman's Guide to Diamond Selection",
            excerpt: 'Understanding the 4Cs and beyond when choosing the perfect diamond piece for your collection.',
            date: 'February 28, 2024',
            category: 'Education',
            readTime: '7 min read',
            image: 'https://images.pexels.com/photos/307847/pexels-photo-307847.jpeg?auto=compress&cs=tinysrgb&w=600',
            slug: '/blog/diamond-guide'
        },
        {
            id: 'spring-collection',
            title: 'Spring Collection 2024: Behind the Design',
            excerpt: 'Explore the inspiration and craftsmanship behind our latest seasonal collection.',
            date: 'February 10, 2024',
            category: 'Collections',
            readTime: '6 min read',
            image: 'https://images.pexels.com/photos/57690/pexels-photo-57690.jpeg?auto=compress&cs=tinysrgb&w=600',
            slug: '/blog/spring-collection'
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative h-[300px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="CrownKing Blog"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-brand-blue-dark/70" />
                </div>

                <div className="container-custom relative z-10 text-white">
                    <h1 className="text-5xl font-bold mb-4">The Journal</h1>
                    <p className="text-xl max-w-2xl">
                        Insights, stories, and advice from the world of men's fine jewelry
                    </p>
                </div>
            </section>

            {/* Featured Article */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <h2 className="heading-lg mb-8 text-center">Featured Article</h2>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="relative h-[300px] lg:h-auto">
                                <Image
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="p-8">
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <span>{featuredPost.category}</span>
                                    <span className="mx-2">•</span>
                                    <span>{featuredPost.readTime}</span>
                                </div>

                                <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>

                                <p className="text-gray-700 mb-6">
                                    {featuredPost.excerpt}
                                </p>

                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 relative overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1623366302587-b38b1ddaefd9?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            alt={featuredPost.author}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">{featuredPost.author}</p>
                                        <p className="text-sm text-gray-500">{featuredPost.authorRole}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">{featuredPost.date}</span>
                                    <Link href="/blog/care-guide" className="btn-primary">
                                        Read Article
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Complete Article */}
            <section className="py-16 bg-brand-cream-light">
                <div className="container-custom">
                    <article className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold mb-4">The Ultimate Men's Jewelry Care Guide</h1>
                            <div className="flex items-center justify-between flex-wrap">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 relative overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1623366302587-b38b1ddaefd9?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            alt={featuredPost.author}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium">{featuredPost.author}</p>
                                        <p className="text-sm text-gray-500">{featuredPost.authorRole}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span>{featuredPost.date}</span>
                                    <span className="mx-2">•</span>
                                    <span>{featuredPost.readTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8 relative h-[400px] rounded-lg overflow-hidden">
                            <Image
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="prose max-w-none">
                            <h2>Introduction</h2>
                            <p>
                                Jewelry is more than just an accessory – it's an investment in your personal style and presentation.
                                Whether you've just purchased your first luxury watch, inherited a family heirloom, or are building
                                a collection of fine pieces, proper care is essential to maintain the beauty and integrity of your jewelry.
                            </p>
                            <p>
                                In this comprehensive guide, we'll explore the essential care techniques for different types of men's
                                jewelry, from precious metals to gemstones, ensuring your pieces remain as impressive as the day you
                                acquired them.
                            </p>

                            <h2>Daily Wear and Care</h2>
                            <p>
                                The way you treat your jewelry during daily activities significantly impacts its longevity. Here are some
                                fundamental practices to incorporate into your routine:
                            </p>
                            <ul>
                                <li>
                                    <strong>Remove before physical activities:</strong> Always remove your jewelry before workouts, sports,
                                    or manual labor to prevent damage, bending, or stone loss.
                                </li>
                                <li>
                                    <strong>Apply products first:</strong> Put on your cologne, hairspray, and skincare products before
                                    wearing your jewelry. Chemicals in these products can damage metals and diminish gemstone brilliance.
                                </li>
                                <li>
                                    <strong>Last on, first off:</strong> Make jewelry the last thing you put on when getting dressed and
                                    the first thing you remove when undressing to minimize exposure to harmful substances.
                                </li>
                            </ul>

                            <h2>Caring for Different Metals</h2>
                            <h3>Gold Jewelry</h3>
                            <p>
                                Gold is durable but can scratch and dent with rough handling. Regular maintenance includes:
                            </p>
                            <ul>
                                <li>
                                    <strong>Gentle cleaning:</strong> Mix mild dish soap with warm water and use a soft cloth or soft-bristled
                                    brush to clean your gold jewelry.
                                </li>
                                <li>
                                    <strong>Thorough rinsing:</strong> Ensure all soap residue is removed by rinsing thoroughly with clean water.
                                </li>
                                <li>
                                    <strong>Proper drying:</strong> Pat dry with a soft, lint-free cloth and allow to air dry completely before
                                    storing.
                                </li>
                            </ul>

                            <h3>Silver Jewelry</h3>
                            <p>
                                Silver is prone to tarnishing when exposed to air and certain chemicals. To maintain its luster:
                            </p>
                            <ul>
                                <li>
                                    <strong>Regular polishing:</strong> Use a silver polishing cloth to maintain shine and remove light tarnish.
                                </li>
                                <li>
                                    <strong>Anti-tarnish strips:</strong> Store with anti-tarnish strips to slow the oxidation process.
                                </li>
                                <li>
                                    <strong>Avoid sulfur-rich environments:</strong> Keep silver jewelry away from hot springs, pools, and
                                    foods high in sulfur.
                                </li>
                            </ul>

                            <h2>Conclusion</h2>
                            <p>
                                Proper jewelry care is an investment in preserving both the monetary and sentimental value of your pieces.
                                By following these guidelines and establishing a regular maintenance routine, you ensure that your jewelry
                                collection remains pristine and continues to make a powerful statement for years to come.
                            </p>
                            <p>
                                Remember that professional cleaning and inspection once or twice a year is also recommended, especially
                                for pieces with intricate settings or significant value. Your jewelry tells your story – make sure it
                                continues to tell it well.
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold mb-4">Share This Article</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-brand-primary transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M19.7.5H4.3C2.3.5.5 2.3.5 4.3v15.4c0 2 1.8 3.8 3.8 3.8h15.4c2 0 3.8-1.8 3.8-3.8V4.3c0-2-1.8-3.8-3.8-3.8zM19 19h-3v-5.6c0-1.4-.5-2.3-1.8-2.3-1 0-1.5.7-1.8 1.3-.1.2-.1.6-.1.9V19h-3s0-9.3 0-10H12v1.4c.4-.7 1.2-1.6 2.9-1.6 2.1 0 3.7 1.4 3.7 4.4V19z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {/* More Articles Section */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <h2 className="heading-lg mb-8 text-center">More Articles</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentPosts.map((post) => (
                            <div key={post.id} className="card overflow-hidden">
                                <div className="relative h-48">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                                        <span>{post.category}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                                    <p className="text-gray-700 mb-4 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{post.date}</span>
                                        <Link href={post.slug} className="text-brand-primary font-medium hover:underline">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-brand-primary text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-bold mb-4">Subscribe to Our Journal</h2>
                    <p className="mb-8 max-w-xl mx-auto">
                        Get expert jewelry insights and care tips delivered straight to your inbox.
                    </p>
                    <form className="max-w-md mx-auto flex gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="input-field flex-1"
                        />
                        <button
                            type="submit"
                            className="bg-brand-secondary text-brand-primary font-medium py-2 px-6 rounded-md hover:bg-brand-cream-dark transition-colors duration-200 whitespace-nowrap"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
} 