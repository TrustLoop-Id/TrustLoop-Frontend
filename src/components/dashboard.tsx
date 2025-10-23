'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from './connect-button';
import { CreateGroupModal, GroupDetails } from './group-management';
import { GroupCard } from './group-management';
import { USDCBalance } from './payment-components';
import { ReputationCard, ReputationHistory} from './reputation-components';
import { useArisanContracts } from './smart-contract-integration';
import { Users, Search, Plus, Wallet, Star, DollarSign, Shield } from 'lucide-react';

export function Dashboard() {
  const { isConnected, address } = useAccount();
  const { allGroups, userGroups, usdcBalance, reputationLevel } = useArisanContracts();
  const [activeTab, setActiveTab] = useState<'my-groups' | 'create' | 'history' | 'reputation'>('my-groups');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

   const filteredGroups = allGroups.filter((groupAddress) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return groupAddress.toLowerCase().includes(query);
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Connect Wallet to Continue
          </h2>
          <p className="text-gray-300">
            Please connect your wallet to access ArisanLink dashboard
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#1C1C1C]">
      {/* Header */}
  <header className="bg-[#1C1C1C] shadow-sm border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center">
                <img
                  src="/assets/logo.png"
                  alt="TrustLoop Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-white">
                  TrustLoop
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {mounted && (
                <>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-400">
                      {parseFloat(usdcBalance).toLocaleString()} USDC
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                  </div>
                </>
              )}
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
  <div className="bg-[#1C1C1C]">
        <div className="container mx-auto px-4 pt-4">
          <nav className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab('my-groups')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'my-groups'
                  ? 'border-[#a57b00] text-[#a57b00]'
                  : 'border-transparent text-[#E0e0E0]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>My Groups</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'create'
                  ?'border-[#a57b00] text-[#a57b00]'
                  : 'border-transparent text-[#E0e0E0]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Get USDC</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reputation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reputation'
                  ?'border-[#a57b00] text-[#a57b00]'
                  : 'border-transparent text-[#E0e0E0]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Reputation</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'my-groups' && (
          <div className="space-y-6">
            {activeTab === 'my-groups' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="fixed bottom-6 right-6 flex items-center space-x-2 px-6 py-3 bg-[#A57B00] hover:bg-[#B8860B] text-white rounded-lg shadow-lg transition-colors z-50"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Group</span>
              </button>
            )}
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search groups by name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-500 rounded-xl  bg-[#232323] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
            </div>

            {allGroups.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#232323] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No Arisan Groups Yet
                </h3>
                <p className="text-gray-300 mb-6">
                  Create your first arisan group to get started
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-[#A57B00] text-white rounded-lg"
                >
                  Create Your First Group
                </button>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#232323] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No Groups Found
                </h3>
                <p className="text-gray-300 mb-6">
                  No groups match your search criteria. Try adjusting your search terms.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-4">
                {allGroups.map((groupAddress) => (
                  <GroupCard 
                    key={groupAddress} 
                    groupAddress={groupAddress}
                    onView={() => setSelectedGroup(groupAddress)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <h2 className="text-2xl font-bold text-white">
                Get Mock USDC
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
              >
              </button>
            </div>

            <div className="max-w-4xl mx-auto">
              <USDCBalance />
            </div>
          </div>
        )}

        {activeTab === 'reputation' && (
          <div className="space-y-6">
            <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white">
              Reputation Overview
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <ReputationCard />
              <ReputationHistory />
            </div>
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      <CreateGroupModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* Group Details Modal */}
      {selectedGroup && (
        <GroupDetails 
          isOpen={!!selectedGroup}
          groupAddress={selectedGroup} 
          onClose={() => setSelectedGroup(null)} 
        />
      )}
    </div>
  );
}