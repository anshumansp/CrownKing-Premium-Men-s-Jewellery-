import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string;
    height?: string;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    animate?: boolean;
    count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    width = 'full',
    height = '20px',
    rounded = 'md',
    animate = true,
    count = 1,
}) => {
    const baseClasses = 'bg-gray-200 inline-block';
    const widthClass = width === 'full' ? 'w-full' : `w-${width}`;
    const heightClass = height.includes('px') || height.includes('%') || height.includes('rem')
        ? `h-[${height}]`
        : `h-${height}`;
    const roundedClass = `rounded-${rounded}`;
    const animateClass = animate ? 'animate-pulse' : '';

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <span
                    key={index}
                    className={`${baseClasses} ${widthClass} ${heightClass} ${roundedClass} ${animateClass} ${className}`}
                    style={{
                        height: height.includes('px') || height.includes('%') || height.includes('rem') ? height : undefined
                    }}
                    data-testid="skeleton-loader"
                />
            ))}
        </>
    );
};

export const ProductCardSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-gray-200 aspect-square w-full mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    );
};

export const TableRowSkeleton = () => {
    return (
        <tr className="animate-pulse">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="ml-3 space-y-1">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
            </td>
        </tr>
    );
};

export const OrderCardSkeleton = () => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
            <div className="bg-gray-50 p-4">
                <div className="flex flex-col sm:flex-row justify-between">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0 mr-4"></div>
                    <div className="flex-grow">
                        <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="mt-3 sm:mt-0 h-4 bg-gray-200 rounded w-48"></div>
            </div>
        </div>
    );
};

export default Skeleton;
