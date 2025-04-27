import { useState } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initCsrfToken } from './api/client';

import CourseCreator from '@/pages/CourseCreatorMainPage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from './contexts/AuthContext';

initCsrfToken()

function Router() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<CourseCreator />} />
                    <Route path="/login/" element={<LoginPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

function App() {
    return (
        <>
            <Router />
            <Toaster />
        </>
    );
}

export default App
