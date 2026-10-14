import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { storageService } from '../services/storageService';
import { GalleryItem } from '../types';
import { Lightbox } from '../components/common/Lightbox';
import { Sparkles, Maximize2, Camera } from 'lucide-react';

interface GalleryProps {
  navigate: (path: string) => void;
}

export const Gallery: React.FC<GalleryProps> = () => {
  const { isBengali } = useLanguage();
  const galleryItems = storageService.getGallery();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    { key: 'all', label: isBengali ? 'সকল ছবি' : 'All Moments' },
    { key: 'movement', label: isBengali ? 'সকালের স্ট্রেচিং ও হাঁটা' : 'Gentle Movement' },
    { key: 'nutrition', label: isBengali ? 'প্রাকৃতিক পুষ্টিকর খাদ্য' : 'Wholesome Food' },
    { key: 'nature', label: isBengali ? 'প্রকৃতি ও উন্মুক্ত পদচারণা' : 'Nature Trails' },
    { key: 'community', label: isBengali ? 'কমিউনিটি চা আড্ডা' : 'Community Circles' },
    { key: 'workshops', label: isBengali ? 'শিক্ষামূলক কর্মশালা' : 'Workshops' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-[#153D32] uppercase bg-[#A8BDA5]/25 px-3 py-1 rounded-full">
          {isBengali ? 'দৃশ্যপটে আমাদের কমিউনিটি' : 'VISUAL SANCTUARY'}
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#153D32] font-semibold leading-tight">
          {isBengali ? 'প্রশান্তি ও সুস্থতার মুহূর্তসমূহ' : 'Moments of Peace, Wholesome Living & Connection'}
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-light">
          {isBengali 
            ? 'আমাদের সকালের সেশন, প্রকৃতির মাঝে হাঁটাচলা এবং পুষ্টিকর রান্না শেখার বাস্তব স্থিরচিত্র।'
            : 'Glimpses into our sunrise breathing circles, outdoor canopy walks, and colorful nourishing meals.'}
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat.key
                ? 'bg-[#153D32] text-[#F8F6F0] font-semibold shadow-xs'
                : 'bg-white text-stone-700 hover:bg-[#E7EFE6] border border-[#A8BDA5]/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveLightboxItem(item)}
            className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 border border-[#A8BDA5]/20"
          >
            <img
              src={item.imageUrl}
              alt={item.altText || item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Soft dark overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-[#153D32]/90 via-[#153D32]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Hover Expand Icon */}
            <div className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Bottom Caption & Title */}
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C6A66A]">
                {isBengali && item.categoryBn ? item.categoryBn : item.category}
              </span>
              <h3 className="font-serif text-lg font-medium leading-snug">
                {isBengali && item.titleBn ? item.titleBn : item.title}
              </h3>
              <p className="text-xs text-[#A8BDA5] line-clamp-1">
                {isBengali && item.captionBn ? item.captionBn : item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        item={activeLightboxItem}
        items={filteredItems}
        onClose={() => setActiveLightboxItem(null)}
        onSelect={(it) => setActiveLightboxItem(it)}
      />
    </div>
  );
};
