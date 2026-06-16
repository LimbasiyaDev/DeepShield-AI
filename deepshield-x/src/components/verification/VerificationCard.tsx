import React from 'react';
import { VerificationStatusBadge } from './VerificationStatusBadge';

interface VerificationCardProps {
  title: string;
  verification: {
    verified: boolean;
    objectId?: string;
    blobId?: string;
    txHash?: string;
    explorerUrl?: string;
    walrusUrl?: string;
    timestamp?: number;
    walrusStatus?: string;
    walrusMessage?: string;
  };
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ title, verification }) => {
  if (!verification) return null;

  // Determine if links are real
  const hasRealObjectId = verification.objectId && !verification.objectId.startsWith('pending') && !verification.objectId.startsWith('mock_');
  const hasRealBlobId = verification.blobId && !verification.blobId.startsWith('mock_') && !verification.blobId.startsWith('demo_');
  const hasRealTxHash = verification.txHash && verification.txHash.length > 20 && !verification.txHash.startsWith('mock_');
  
  if (!verification.objectId && !verification.blobId) {
    return null; // Do not show verification cards if totally empty
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h4>
        <VerificationStatusBadge verified={verification.verified} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 block text-xs">Sui Object ID</span>
          {hasRealObjectId ? (
            <a 
              href={verification.explorerUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 truncate block font-mono"
            >
              {verification.objectId}
            </a>
          ) : (
            <span className="text-amber-400 truncate block font-mono italic">Pending Verification</span>
          )}
        </div>
        
        <div>
          <span className="text-gray-500 block text-xs">Walrus Blob ID {verification.walrusStatus === 'Fallback' && <span className="text-amber-500 font-bold ml-1">(Local Cache)</span>}</span>
          <a 
            href={verification.walrusUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`truncate block font-mono ${verification.walrusStatus === 'Fallback' ? 'text-amber-400 hover:text-amber-300' : 'text-purple-400 hover:text-purple-300'}`}
          >
            {verification.blobId || 'N/A'}
          </a>
          {verification.walrusMessage && verification.walrusStatus === 'Fallback' && (
             <div className="text-[10px] text-amber-500 mt-1">{verification.walrusMessage}</div>
          )}
        </div>

        <div>
          <span className="text-gray-500 block text-xs">Transaction Hash</span>
          <span className="text-gray-300 font-mono truncate block">
            {hasRealTxHash ? verification.txHash : <span className="text-amber-400 italic">Pending Verification</span>}
          </span>
        </div>
        
        <div>
          <span className="text-gray-500 block text-xs">Timestamp</span>
          <span className="text-gray-300">
            {verification.timestamp ? new Date(verification.timestamp).toLocaleString() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};
