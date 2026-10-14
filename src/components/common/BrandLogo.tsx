import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { storageService } from '../../services/storageService';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
  light = false,
}) => {
  const { isBengali } = useLanguage();
  const settings = storageService.getSettings();

  const brandName = isBengali ? settings.brandNameBn || settings.brandName : settings.brandName;
  const tagline = isBengali ? settings.taglineBn || settings.tagline : settings.tagline;

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl md:text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Nature & Sun Wellness Emblem */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-full bg-[#153D32] border border-[#C6A66A]/40 shadow-sm transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          {/* Subtle Sun Rays */}
          <circle cx="20" cy="20" r="17" stroke="#C6A66A" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6" />
          <circle cx="20" cy="20" r="14" stroke="#A8BDA5" strokeWidth="0.8" opacity="0.4" />
          
          {/* Gentle Leaf Shape */}
          <path
            d="M20 7C20 7 29 11 29 21C29 26.5 24.5 31 20 31C15.5 31 11 26.5 11 21C11 11 20 7 20 7Z"
            fill="#A8BDA5"
            fillOpacity="0.25"
          />
          <path
            d="M20 7C20 7 28 12 27 21C26 27 21 31 20 31C19 31 14 27 13 21C12 12 20 7 20 7Z"
            stroke="#C6A66A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Leaf Central Vein / Upward Sprout */}
          <path
            d="M20 30V12"
            stroke="#C6A66A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M20 22C22.5 20.5 24 18 25 15"
            stroke="#A8BDA5"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M20 25C17.5 23.5 16 21 15 18"
            stroke="#A8BDA5"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Inner Golden Seed / Sun Sparkle */}
          <circle cx="20" cy="11" r="1.5" fill="#C6A66A" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif tracking-tight font-medium ${textSizes[size]} ${
            light ? 'text-[#F8F6F0]' : 'text-[#153D32]'
          }`}
        >
          {brandName}
        </span>
        {showTagline && (
          <span
            className={`text-xs tracking-wide uppercase ${
              light ? 'text-[#A8BDA5]' : 'text-[#252A27]/70'
            }`}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
};
