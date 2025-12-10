import Link from 'next/link';
import { HotelIcon } from './icons';
import { UserNav } from './user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <HotelIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">HotelVerse</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
