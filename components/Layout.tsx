"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DarkModeToggle } from "./DarkModeToggle"

const navItems = [
  { name: "Home", path: "/" },
  { name: "Production Line", path: "/production-line" },
  { name: "Healthcare", path: "/healthcare" },
  { name: "Insurance", path: "/insurance" },
  { name: "App Builder", path: "/app-builder" },
  { name: "AI Model", path: "/ai-model" },
  { name: "Training Centre", path: "/training-centre" },
]

export default function Layout({ children }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <header className="bg-gray-800 text-white p-4 transition-colors duration-300 dark:bg-gray-950">
        <nav className="container mx-auto flex justify-between items-center">
          <ul className="flex flex-wrap space-x-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`hover:text-gray-300 transition-colors duration-200 ${
                    pathname === item.path ? "font-bold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <DarkModeToggle />
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  )
}

