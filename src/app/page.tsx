'use client';

import { ConnectButton } from '@/components/connect-button';
import { Dashboard } from '@/components/dashboard';
import { VantaBackground } from '@/components/vanta-background';
import { useAccount } from 'wagmi';
import { ScrollText ,EyeOff ,AlertTriangle, Shield, Users, Zap, Lock, Check, ArrowRight, Coins, Globe, Key, Fuel, Banknote } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { isConnected } = useAccount();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering after mount when connection status is known
  if (mounted && isConnected) {
    return <Dashboard />;
  }

  if (!mounted) {
    return null;
  }

  const features = [
    {
      icon: Shield,
      title: 'Dual Payment System',
      description: '50 USDC monthly + 50 USDC guarantee deposit for maximum security',
    },
    {
      icon: Lock,
      title: '80/20 Payout System',
      description: '80% immediate payout (after 2.5% fee), 20% escrow for progressive security',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Users,
      title: 'Reputation System',
      description: 'On-chain reputation tracking with penalties for defaults',
    },
    {
      icon: Zap,
      title: 'Smart Default Handling',
      description: 'Automatic pot adjustment and security deposit forfeiture',
    },
  ];
  
  const problems = [
  {
    icon: AlertTriangle,
    title: 'High Fraud Risk',
    description: "Coordinators or members can run away with the group's money",
  },
  {
    icon: EyeOff,
    title: 'Lack of Transparency',
    description: 'Difficult to track payments, manual draws can be manipulated',
  },
  {
    icon: ScrollText,
    title: 'Manual Management',
    description: 'Manual record-keeping via WhatsApp, error-prone and inefficient',
  }
];

  const stats = [
    { value: '100%', label: 'Secure', icon: Shield },
    { value: '0%', label: 'Trust Required', icon: Lock },
    { value: '24/7', label: 'Available', icon: Globe },
  ];

  return (
  <div className="min-h-screen" style={{ background: '#1C1C1C' }}>
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center">
                <img
                  src="/assets/logo.png"
                  alt="TrustLoop Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TRUSTLOOP</h1>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>


      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden mb-20">
        <VantaBackground />
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-white/50 backdrop-blur-sm" >
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white-300">Built on Base Blockchain</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-[#E0E0E0] leading-tight drop-shadow-lg">
              Decentralized Rotating<br />
              Savings Protocol
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              first decentralized arisan platform with dual payment system
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <a
                href="#introduction"
                className="px-8 py-3 border-2 border-white/30 text-white rounded-xl font-medium hover:border-white/50 hover:bg-white/10 transition-all flex items-center space-x-2 backdrop-blur-sm"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (Product Advantages) */}
      <section id="introduction" className="py-20 px-4" style={{ background: '#1C1C1C' }}>
        <div className="container mx-auto max-w-6xl">

          {/* Intro Text */}
          <div className="text-center mb-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
              What is <span className="text-[#D4AF37]">TrustLoop</span>?
            </h2>
            <p className="text-2xl text-white">
              TrustLoop is a decentralized rotating savings platform built for communities. 
              It allows members to contribute USDC regularly, take turns receiving the pooled funds, 
              and build financial trust. All powered by smart contracts for transparency, fairness, 
              and automation.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="text-center grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="p-6 bg-gradient-to-br rounded-xl from-[#7A5E00] to-[#D4AF37]">
                  <Icon className="w-8 h-8 text-[#E0E0E0] mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-[#E0E0E0]">{stat.label}</div>
                </div>
              );
            })}
          </div>
          
        </div>
      </section>


      {/* How It Works */}
      <section className="py-20 px-4" style={{ background: '#1C1C1C' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 text-white">
              Easy, fast, and secure
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Connect your wallet to the platform' },
              { step: '2', title: 'Create/Join Group', desc: 'Create a new group or join an existing one' },
              { step: '3', title: 'Pay Deposit', desc: 'Pay contribution + security deposit' },
              { step: '4', title: 'Auto-Pilot', desc: 'Smart contracts handle everything automatically' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-xl">
                  <span
                    className="w-full h-full flex items-center justify-center text-2xl font-bold rounded-2xl bg-gradient-to-br from-[#7A5E00] to-[#D4AF37]"
                  >
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 text-white">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4" style={{ background: '#1C1C1C' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-white mb-4">
              Traditional Arisan Problems
            </h2>
            <p className="text-xl text-gray-600 text-white">
              Why conventional arisan is vulnerable to fraud and inefficient
            </p>
          </div>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, idx) => {
            const Icon = problem.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl border-2 border-red-900 bg-[#252525]" style={{ background: '#252525' }}>
                <div className="w-14 h-14 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
                <p className="text-white">{problem.description}</p>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Smart Contract Solution
            </h2>
            <p className="text-xl text-gray-600 text-white">
              Dual payment system with 80/20 payouts and progressive escrow
            </p>
          </div>

          <div className="grid max-w-2xl gap-8 mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveFeature(index)}
                  className={`p-8 rounded-2xl border-2 transition-all cursor-pointer ${
                    'bg-[#252525] border-[#A57B00]/60'
                  }`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br bg-gradient-to-br from-[#7A5E00] to-[#D4AF37] rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-white text-lg">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
  <footer className="text-white py-12 px-4" style={{ background: '#1C1C1C' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="/assets/logo.png"
                  alt="TrustLoop Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">TRUSTLOOP</h3>
                <p className="text-sm text-gray-400">Decentralize Rotating Saving</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-1">
                © 2025 TrustLoop
              </p>
              <p className="text-sm text-gray-500 text-center">
              Designed & Created by Daniel Sukamto&nbsp;&nbsp;|&nbsp;&nbsp;Vermont William
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
