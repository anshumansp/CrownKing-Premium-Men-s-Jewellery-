'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Tab {
    id: string;
    label: string;
}

interface TabSectionProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

const TabSection: React.FC<TabSectionProps> = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="flex justify-center mb-12 border-b border-gray-200">
            <div className="inline-flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`py-4 text-sm font-medium relative ${activeTab === tab.id ? 'text-brand-primary' : 'text-gray-500 hover:text-brand-blue-light'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                                initial={false}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TabSection; 