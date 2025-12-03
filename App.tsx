import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectPage from './pages/ProjectPage';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CursorGravity from './components/CursorGravity';

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 200);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[9999]">
        <div className="max-w-md w-full px-8">
          {/* Retro Game Loading Text */}
          <div className="text-center mb-8">
            <h2 className="font-pixel text-2xl text-neon-green mb-2 animate-pulse">
              LOADING...
            </h2>
            <p className="font-mono text-slate-400 text-sm">
              Initializing Portfolio v2.0
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="relative w-full h-8 border-4 border-neon-green/50 bg-slate-900 pixel-corners overflow-hidden">
            {/* Animated Progress Fill */}
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-green to-green-400 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            >
              {/* Pixel Pattern Overlay */}
              <div className="absolute inset-0 opacity-30 pixel-pattern"></div>
            </div>

            {/* Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-pixel text-white text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] z-10">
                {Math.floor(progress)}%
              </span>
            </div>
          </div>

          {/* Retro Loading Dots */}
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-3 h-3 bg-neon-green animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-neon-green animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-neon-green animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 relative selection:bg-neon-green selection:text-slate-950">
        
        {/* Cursor Gravity Effect */}
        <CursorGravity />
        
        {/* Ambient Liquid Blobs for Glass Effect */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
          <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-neon-green/10 rounded-full blur-[100px] animate-blob delay-2000 mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-blob delay-4000 mix-blend-screen"></div>
        </div>

        {/* CRT Overlay Effect - Subtle scanlines */}
        <div className="fixed inset-0 pointer-events-none z-50 opacity-10 crt-overlay"></div>
        
        {/* Background Gradient for depth */}
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950 z-0"></div>

        <div className="relative z-10">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <main>
                  <Hero />
                  <Projects />
                  <Skills />
                  <Contact />
                </main>
                <Footer />
              </>
            } />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;