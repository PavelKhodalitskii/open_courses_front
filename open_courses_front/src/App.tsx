import { useState } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CourseCreator from '@/pages/CourseCreatorMainPage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'

import { Toaster } from "@/components/ui/sonner";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CourseCreator />} />
        <Route path="/login/" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
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
