'use client';

import { useEffect, useRef, useState } from 'react';

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    // Load Three.js first
    const loadThree = () => {
      return new Promise((resolve, reject) => {
        if ((window as any).THREE) {
          resolve(true);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        script.async = false; // Changed to false for sequential loading
        script.onload = () => {
          console.log('Three.js loaded');
          resolve(true);
        };
        script.onerror = (e) => {
          console.error('Three.js failed to load', e);
          reject(e);
        };
        document.body.appendChild(script);
      });
    };

    // Load Vanta.js
    const loadVanta = () => {
      return new Promise((resolve, reject) => {
        if ((window as any).VANTA?.NET) {
          resolve(true);
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
        script.async = false; // Changed to false for sequential loading
        script.onload = () => {
          console.log('Vanta.js loaded');
          resolve(true);
        };
        script.onerror = (e) => {
          console.error('Vanta.js failed to load', e);
          reject(e);
        };
        document.body.appendChild(script);
      });
    };

    // Initialize Vanta
    const initVanta = async () => {
      try {
        await loadThree();
        await loadVanta();
        
        // Add small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!isMounted || !vantaRef.current) return;
        
        if ((window as any).VANTA?.NET) {
          console.log('Initializing Vanta NET effect');
          
          vantaEffect.current = (window as any).VANTA.NET({
            el: vantaRef.current,
            THREE: (window as any).THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xa57b00,
            backgroundColor: 0x1C1C1C,
            points: 17.00,
            maxDistance: 17.00,
            spacing: 17.00
          });
          
          console.log('Vanta effect initialized', vantaEffect.current);
        } else {
          console.error('VANTA.NET not available');
        }
      } catch (error) {
        console.error('Error loading Vanta:', error);
      }
    };

    initVanta();

    // Cleanup
    return () => {
      isMounted = false;
      if (vantaEffect.current) {
        console.log('Destroying Vanta effect');
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <div 
      ref={vantaRef} 
      className="absolute inset-0 w-full h-full"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}
    />
  );
}