import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Heart, Search, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  onSearch?: (query: string) => void;
}

export function Navigation({ onSearch }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      }
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Beranda', href: '/beranda' },
    { label: 'Katalog', href: '/katalog' },
  ];

  if (isAdmin) {
    navLinks.push({ label: 'Admin', href: '/admin' });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F7F2E9]/95 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to={isAuthenticated ? "/beranda" : "/"} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#D64A58] rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-['Fredoka'] text-xl lg:text-2xl font-semibold text-[#2B2B2B]">
              ULFAMART
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#D64A58] ${
                  location.pathname === link.href
                    ? 'text-[#D64A58]'
                    : 'text-[#2B2B2B]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Wishlist - hanya untuk user biasa */}
            {!isAdmin && (
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#D64A58] text-[10px]">
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart - hanya untuk user biasa */}
            {!isAdmin && (
              <Link to="/keranjang">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartState.totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#D64A58] text-[10px]">
                      {cartState.totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* User */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {user?.name}
                    {isAdmin && <span className="ml-2 text-xs text-[#D64A58]">(Admin)</span>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {!isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/pesanan-saya">Pesanan Saya</Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Dashboard Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/masuk">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#F7F2E9]">
                <SheetTitle className="font-['Fredoka'] text-xl">
                  Menu
                </SheetTitle>
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`text-lg font-medium py-2 border-b border-[#2B2B2B]/10 ${
                        location.pathname === link.href
                          ? 'text-[#D64A58]'
                          : 'text-[#2B2B2B]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <Link
                      to="/masuk"
                      className="text-lg font-medium py-2 border-b border-[#2B2B2B]/10 text-[#2B2B2B]"
                    >
                      Masuk
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#F7F2E9] shadow-lg p-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" className="bg-[#D64A58] hover:bg-[#c43d4b]">
              <Search className="w-4 h-4 mr-2" />
              Cari
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
