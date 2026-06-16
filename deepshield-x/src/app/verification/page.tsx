'use client';

import React from 'react';
import { ShieldCheck, FileSearch } from 'lucide-react';
import { useReplay } from '@/hooks/useReplay';
import { VerificationCard } from '@/components/verification/VerificationCard';
import { VerificationStatusBadge } from '@/components/verification/VerificationStatusBadge';

export default function VerificationCenterPage() {
  const { history: historyQuery } = useReplay();
  const { data: history, isLoading } = historyQuery;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-blue-400" />
              Verification Center
            </h1>
            <p className="text-gray-400 mt-2">
              Transparent, verifiable on-chain protection records and AI reports stored on Sui and Walrus.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg border border-gray-700">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-300">Sui Testnet Connected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-800 rounded-lg"></div>
              <div className="h-32 bg-gray-800 rounded-lg"></div>
            </div>
          ) : history && history.length > 0 ? (
            history.map((record: any, idx: number) => (
              <div key={record.id || idx} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:border-gray-600 transition-colors">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
                        <FileSearch className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {record.token || 'Unknown'} Protection Record
                        </h3>
                        <p className="text-sm text-gray-400">
                          {record.action} • Saved {record.saved}
                        </p>
                      </div>
                    </div>
                    {record.verification && (
                      <VerificationStatusBadge verified={record.verification.verified} />
                    )}
                  </div>
                  
                  {record.verification ? (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <VerificationCard 
                        title="On-Chain Protection Proof"
                        verification={record.verification}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-500">
                      Legacy record. No on-chain proof available.
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <ShieldCheck className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No verifiable protection records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
