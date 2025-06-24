

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  checkAuth: () => Promise<void>
}

interface RegisterData {
  full_name: string
  email: string
  phone?: string
  age?: number
  sex?: string
  password: string
  confirmPassword: string
  profile_picture?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      console.log("Checking auth, token exists:", !!token)

      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Auth check response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Auth check data:", data)

        if (data.success && data.user) {
          setUser(data.user)
          console.log("User authenticated:", data.user.email, "Role:", data.user.role)
        } else {
          localStorage.removeItem("auth_token")
          setUser(null)
          console.log("Auth check failed, removing token")
        }
      } else {
        localStorage.removeItem("auth_token")
        setUser(null)
        console.log("Auth check response not ok, removing token")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("auth_token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response status:", response.status)
      const data = await response.json()
      console.log("Login response data:", data)

      if (data.success && data.user && data.token) {
        console.log("Login successful, storing token and setting user")

        // Store token
        localStorage.setItem("auth_token", data.token)

        // Set user state
        setUser(data.user)

        console.log("User role:", data.user.role)

        // Small delay to ensure state is updated
        setTimeout(() => {
          // Redirect based on role
          switch (data.user.role) {
            case "admin":
              console.log("Redirecting to admin dashboard")
              router.push("/admin/dashboard")
              break
            case "instructor":
              console.log("Redirecting to instructor dashboard")
              router.push("/instructor/dashboard")
              break
            case "student":
              console.log("Redirecting to student dashboard")
              router.push("/dashboard")
              break
            default:
              console.log("Redirecting to default dashboard")
              router.push("/dashboard")
          }
        }, 100)

        return { success: true }
      } else {
        console.log("Login failed:", data.message)
        return { success: false, message: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Login failed. Please try again." }
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      console.log("Attempting registration for:", userData.email)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      console.log("Registration response:", data)

      if (data.success) {
        localStorage.setItem("auth_token", data.token)
        setUser(data.user)

        setTimeout(() => {
          router.push("/login")
        }, 100)

        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: "Registration failed. Please try again." }
    }
  }

  const logout = () => {
    console.log("Logging out user:", user?.email)
    localStorage.removeItem("auth_token")
    setUser(null)

    // Add a small delay to ensure state is cleared
    setTimeout(() => {
      router.push("/")
    }, 100)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user && !!localStorage.getItem("auth_token"),
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


// "use client"

// import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
// import { useRouter } from "next/navigation"
// import type { User } from "@/lib/auth"

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
//   register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>
//   logout: () => void
//   checkAuth: () => Promise<void>
// }

// interface RegisterData {
//   full_name: string
//   email: string
//   phone?: string
//   age?: number
//   sex?: string
//   password: string
//   confirmPassword: string
//   profile_picture?: string
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem("auth_token")
//       console.log("Checking auth, token exists:", !!token)

//       if (!token) {
//         setLoading(false)
//         return
//       }

//       const response = await fetch("/api/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       console.log("Auth check response status:", response.status)

//       if (response.ok) {
//         const data = await response.json()
//         console.log("Auth check data:", data)

//         if (data.success) {
//           setUser(data.user)
//           console.log("User set:", data.user)
//         } else {
//           localStorage.removeItem("auth_token")
//           console.log("Auth check failed, removing token")
//         }
//       } else {
//         localStorage.removeItem("auth_token")
//         console.log("Auth check response not ok, removing token")
//       }
//     } catch (error) {
//       console.error("Auth check error:", error)
//       localStorage.removeItem("auth_token")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (email: string, password: string) => {
//     try {
//       console.log("Attempting login for:", email)

//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       })

//       console.log("Login response status:", response.status)
//       const data = await response.json()
//       console.log("Login response data:", data)

//       if (data.success && data.user && data.token) {
//         console.log("Login successful, storing token and setting user")

//         // Store token
//         localStorage.setItem("auth_token", data.token)

//         // Set user state
//         setUser(data.user)

//         console.log("User role:", data.user.role)

//         // Small delay to ensure state is updated
//         setTimeout(() => {
//           // Redirect based on role
//           switch (data.user.role) {
//             case "admin":
//               console.log("Redirecting to admin dashboard")
//               router.push("/admin/dashboard")
//               break
//             case "instructor":
//               console.log("Redirecting to instructor dashboard")
//               router.push("/instructor/dashboard")
//               break
//             case "student":
//               console.log("Redirecting to student dashboard")
//               router.push("/dashboard")
//               break
//             default:
//               console.log("Redirecting to default dashboard")
//               router.push("/dashboard")
//           }
//         }, 100)

//         return { success: true }
//       } else {
//         console.log("Login failed:", data.message)
//         return { success: false, message: data.message || "Login failed" }
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//       return { success: false, message: "Login failed. Please try again." }
//     }
//   }

//   const register = async (userData: RegisterData) => {
//     try {
//       console.log("Attempting registration for:", userData.email)

//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       })

//       const data = await response.json()
//       console.log("Registration response:", data)

//       if (data.success) {
//         localStorage.setItem("auth_token", data.token)
//         setUser(data.user)

//         setTimeout(() => {
//           router.push("/login")
//         }, 100)

//         return { success: true }
//       } else {
//         return { success: false, message: data.message }
//       }
//     } catch (error) {
//       console.error("Registration error:", error)
//       return { success: false, message: "Registration failed. Please try again." }
//     }
//   }

//   const logout = () => {
//     console.log("Logging out")
//     localStorage.removeItem("auth_token")
//     setUser(null)
//     router.push("/")
//   }

//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const value = {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//     checkAuth,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
