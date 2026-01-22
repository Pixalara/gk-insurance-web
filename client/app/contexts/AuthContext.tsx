'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Admin {
    email: string;
    name: string;
}

interface AuthContextType {
    admin: Admin | null;
    login: (email: string, password: string) => boolean;
    signup: (email: string, password: string, name: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        // Check if user is logged in on mount
        const storedAdmin = localStorage.getItem('gk_admin');
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Protect admin routes
        if (!isLoading && mounted) {
            const isAdminRoute = pathname?.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/signup';
            if (isAdminRoute && !admin) {
                router.push('/admin/login');
            }
        }
    }, [admin, pathname, isLoading, mounted, router]);

    const signup = (email: string, password: string, name: string): boolean => {
        // Get existing admins
        const admins = JSON.parse(localStorage.getItem('gk_admins') || '[]');

        // Check if email already exists
        if (admins.find((a: any) => a.email === email)) {
            return false;
        }

        // Create new admin
        const newAdmin = { email, password, name };
        admins.push(newAdmin);
        localStorage.setItem('gk_admins', JSON.stringify(admins));

        // Auto-login after signup
        const adminData = { email, name };
        setAdmin(adminData);
        localStorage.setItem('gk_admin', JSON.stringify(adminData));

        return true;
    };

    const login = (email: string, password: string): boolean => {
        const admins = JSON.parse(localStorage.getItem('gk_admins') || '[]');
        const foundAdmin = admins.find(
            (a: any) => a.email === email && a.password === password
        );

        if (foundAdmin) {
            const adminData = { email: foundAdmin.email, name: foundAdmin.name };
            setAdmin(adminData);
            localStorage.setItem('gk_admin', JSON.stringify(adminData));
            return true;
        }

        return false;
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('gk_admin');
        router.push('/admin/login');
    };

    return (
        <AuthContext.Provider
            value={{
                admin,
                login,
                signup,
                logout,
                isAuthenticated: !!admin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
