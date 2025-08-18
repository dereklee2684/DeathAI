import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'navbar' | '2xl' | '3xl' | '4xl' | '7xl'
  showText?: boolean
  useImage?: boolean
}

export default function Logo({ className, size = 'md', showText = true, useImage = false }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    navbar: 'w-16 h-16',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32',
    '4xl': 'w-48 h-48',
    '7xl': 'w-80 h-80'
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {useImage ? (
        <Image
          src="/images/logo.png"
          alt="Storiats Logo"
          width={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : size === 'xl' ? 64 : size === '2xl' ? 96 : size === '3xl' ? 128 : size === '4xl' ? 192 : size === '7xl' ? 320 : 64}
          height={size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : size === 'xl' ? 64 : size === '2xl' ? 96 : size === '3xl' ? 128 : size === '4xl' ? 192 : size === '7xl' ? 320 : 64}
          className="object-contain mix-blend-multiply"
          priority={true}
          loading="eager"
        />
      ) : (
        <div className={cn('bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg', sizeClasses[size])}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-3/4 h-3/4 text-white"
          >
            {/* Memory/Story concept - Book with heart */}
            {/* Book base */}
            <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />

            {/* Book pages */}
            <line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1" />
            <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1" />
            <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1" />
            <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1" />

            {/* Heart symbol */}
            <path
              d="M12 16.5C12 16.5 13.5 15 15 15C16.5 15 18 16.5 18 18C18 19.5 16.5 21 15 21C13.5 21 12 19.5 12 18C12 19.5 10.5 21 9 21C7.5 21 6 19.5 6 18C6 16.5 7.5 15 9 15C10.5 15 12 16.5 12 16.5Z"
              fill="currentColor"
            />

            {/* Sparkle effect */}
            <circle cx="6" cy="8" r="0.5" fill="currentColor" />
            <circle cx="18" cy="10" r="0.5" fill="currentColor" />
            <circle cx="7" cy="16" r="0.5" fill="currentColor" />
          </svg>
        </div>
      )}
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Storiats
        </span>
      )}
    </div>
  )
} 