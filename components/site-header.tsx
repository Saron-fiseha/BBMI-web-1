"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react"

export function SiteHeader() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const getDashboardLink = () => {
    if (!user) return "/dashboard"

    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "instructor":
        return "/instructor/dashboard"
      default:
        return "/dashboard"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-mustard to-deep-purple"></div>
          <span className="text-xl font-bold text-charcoal">BBMI</span>
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-charcoal hover:text-mustard transition-colors">
            Home
          </Link>
          <Link href="/courses" className="text-charcoal hover:text-mustard transition-colors">
            Courses
          </Link>
          <Link href="/instructors" className="text-charcoal hover:text-mustard transition-colors">
            Instructors
          </Link>
          <Link href="/about" className="text-charcoal hover:text-mustard transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-charcoal hover:text-mustard transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop Auth - Right */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-mustard/20 transition-colors"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={user.profile_picture || "/placeholder.svg?height=64&width=64"}
                      alt={user.full_name}
                    />
                    <AvatarFallback className="bg-mustard text-white font-semibold">
                      {user.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="absolute -bottom-1 -right-1 h-4 w-4 bg-white rounded-full p-0.5 border border-gray-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <p className="text-xs leading-none text-mustard capitalize font-medium">{user.role}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-mustard hover:bg-mustard/90">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-ivory">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-charcoal hover:text-mustard transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/courses"
                className="text-charcoal hover:text-mustard transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                href="/instructors"
                className="text-charcoal hover:text-mustard transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Instructors
              </Link>
              <Link
                href="/about"
                className="text-charcoal hover:text-mustard transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-charcoal hover:text-mustard transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            {isAuthenticated && user ? (
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profile_picture || "/placeholder.svg?height=64&width=64"}
                      alt={user.full_name}
                    />
                    <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleLogout} className="justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t space-y-2">
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}



// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { useAuth } from "@/hooks/use-auth"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Menu, X, User, Settings, LogOut } from "lucide-react"

// export function SiteHeader() {
//   const { user, logout, isAuthenticated } = useAuth()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   const handleLogout = () => {
//     logout()
//     setIsMenuOpen(false)
//   }

//   const getDashboardLink = () => {
//     if (!user) return "/dashboard"

//     switch (user.role) {
//       case "admin":
//         return "/admin/dashboard"
//       case "instructor":
//         return "/instructor/dashboard"
//       default:
//         return "/dashboard"
//     }
//   }

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/60">
//       <div className="container flex h-16 items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="flex items-center space-x-2">
//           <div className="h-8 w-8 rounded-full bg-gradient-to-r from-mustard to-deep-purple"></div>
//           <span className="text-xl font-bold text-charcoal">BBMI</span>
//         </Link>

//         {/* Desktop Navigation - Center */}
//         <nav className="hidden md:flex items-center space-x-8">
//           <Link href="/" className="text-charcoal hover:text-mustard transition-colors">
//             Home
//           </Link>
//           <Link href="/courses" className="text-charcoal hover:text-mustard transition-colors">
//             Courses
//           </Link>
//           <Link href="/instructors" className="text-charcoal hover:text-mustard transition-colors">
//             Instructors
//           </Link>
//           <Link href="/about" className="text-charcoal hover:text-mustard transition-colors">
//             About
//           </Link>
//           <Link href="/contact" className="text-charcoal hover:text-mustard transition-colors">
//             Contact
//           </Link>
//         </nav>

//         {/* Desktop Auth - Right */}
//         <div className="hidden md:flex items-center space-x-4">
//           {isAuthenticated && user ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage
//                       src={user.profile_picture || "/placeholder.svg?height=64&width=64"}
//                       alt={user.full_name}
//                     />
//                     <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium leading-none">{user.full_name}</p>
//                     <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
//                     <p className="text-xs leading-none text-mustard capitalize">{user.role}</p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <Link href={getDashboardLink()}>
//                     <User className="mr-2 h-4 w-4" />
//                     Dashboard
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/profile">
//                     <Settings className="mr-2 h-4 w-4" />
//                     Profile
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={handleLogout}>
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <>
//               <Button variant="ghost" asChild>
//                 <Link href="/login">Login</Link>
//               </Button>
//               <Button asChild>
//                 <Link href="/register">Register</Link>
//               </Button>
//             </>
//           )}
//         </div>

//         {/* Mobile menu button */}
//         <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//           {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//         </Button>
//       </div>

//       {/* Mobile Navigation */}
//       {isMenuOpen && (
//         <div className="md:hidden border-t bg-ivory">
//           <div className="container py-4 space-y-4">
//             <nav className="flex flex-col space-y-4">
//               <Link
//                 href="/"
//                 className="text-charcoal hover:text-mustard transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/courses"
//                 className="text-charcoal hover:text-mustard transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Courses
//               </Link>
//               <Link
//                 href="/instructors"
//                 className="text-charcoal hover:text-mustard transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Instructors
//               </Link>
//               <Link
//                 href="/about"
//                 className="text-charcoal hover:text-mustard transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 About
//               </Link>
//               <Link
//                 href="/contact"
//                 className="text-charcoal hover:text-mustard transition-colors"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Contact
//               </Link>
//             </nav>

//             {isAuthenticated && user ? (
//               <div className="pt-4 border-t space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage
//                       src={user.profile_picture || "/placeholder.svg?height=64&width=64"}
//                       alt={user.full_name}
//                     />
//                     <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="text-sm font-medium">{user.full_name}</p>
//                     <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
//                   </div>
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   <Button variant="ghost" asChild className="justify-start">
//                     <Link href={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
//                       <User className="mr-2 h-4 w-4" />
//                       Dashboard
//                     </Link>
//                   </Button>
//                   <Button variant="ghost" asChild className="justify-start">
//                     <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
//                       <Settings className="mr-2 h-4 w-4" />
//                       Profile
//                     </Link>
//                   </Button>
//                   <Button variant="ghost" onClick={handleLogout} className="justify-start">
//                     <LogOut className="mr-2 h-4 w-4" />
//                     Log out
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="pt-4 border-t space-y-2">
//                 <Button variant="ghost" asChild className="w-full justify-start">
//                   <Link href="/login" onClick={() => setIsMenuOpen(false)}>
//                     Login
//                   </Link>
//                 </Button>
//                 <Button asChild className="w-full">
//                   <Link href="/register" onClick={() => setIsMenuOpen(false)}>
//                     Register
//                   </Link>
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }
