import React from 'react';
import { GameState, ContractDefinition, ContractObjective } from '../types';
import { getAvailableContracts, getContractById } from '../contracts';
import { getObjectiveProgress } from '../gameLogic';
import { FileText, Clock, CheckCircle, XCircle, Award } from 'lucide-react';
import { BUILDINGS } from "@/constants.ts";

interface ContractsPanelProps {
  gameState: GameState;
  onActivateContract: (contractId: string) => void;
  onAbandonContract: () => void;
  currentLps: number;
}

export const ContractsPanel: React.FC<ContractsPanelProps> = ({
  gameState,
  onActivateContract,
  onAbandonContract,
  currentLps
}) => {
  const availableContracts = getAvailableContracts(gameState);
  const activeContract = gameState.activeContract
    ? getContractById(gameState.activeContract.contractId)
    : null;

  const formatObjective = (obj: ContractObjective): string => {
    switch (obj.type) {
      case 'DELIVER_TOTAL':
        return `Deliver ${obj.targetValue.toLocaleString()} letters this run`;
      case 'DELIVER_RATE':
        return `Reach ${obj.targetValue.toLocaleString()} letters per second`;
      case 'CLICK_COUNT':
        return `Click the delivery button ${obj.targetValue.toLocaleString()} times`;
      case 'TIME_LIMIT':
        const minutes = Math.floor((obj.extra?.timeLimitSeconds || 0) / 60);
        return `Deliver ${obj.targetValue.toLocaleString()} letters in ${minutes} minutes`;
      case 'NO_BUILDING':
        return `Don't buy any ${BUILDINGS.filter(b => b.id === obj.extra?.buildingId)[0]?.name || 'specific'} buildings`;
      case 'PRESTIGE_STAMPS':
        return `Prestige with at least ${obj.targetValue} stamps earned`;
      default:
        return 'Unknown objective';
    }
  };

  const getProgressValue = (obj: ContractObjective): number => {
    if (!gameState.activeContract) return 0;
    return getObjectiveProgress(obj, gameState.activeContract.progress, gameState);
  };

  const getCurrentValue = (obj: ContractObjective): string => {
    if (!gameState.activeContract) return '0';

    const progress = gameState.activeContract.progress;

    switch (obj.type) {
      case 'DELIVER_TOTAL':
      case 'TIME_LIMIT':
        return (progress.deliveredThisRun || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
      case 'DELIVER_RATE':
        return (progress.maxLpsThisRun || 0).toLocaleString(undefined, { maximumFractionDigits: 1 });
      case 'CLICK_COUNT':
        return (progress.clicksThisRun || 0).toLocaleString();
      case 'NO_BUILDING':
        const buildingCount = gameState.buildings[obj.extra?.buildingId || ''] || 0;
        return buildingCount === 0 ? '✓ None' : `✗ ${buildingCount}`;
      default:
        return '?';
    }
  };

  const getTimeRemaining = (): string | null => {
    if (!gameState.activeContract || !activeContract) return null;

    const timeObjective = activeContract.objectives.find(obj => obj.type === 'TIME_LIMIT');
    if (!timeObjective || !timeObjective.extra?.timeLimitSeconds) return null;

    const elapsed = (Date.now() - (gameState.activeContract.progress.startedAt || Date.now())) / 1000;
    const remaining = timeObjective.extra.timeLimitSeconds - elapsed;

    if (remaining <= 0) return 'TIME UP!';

    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatReward = (contract: ContractDefinition): string => {
    const parts = [];
    if (contract.reward.credits) parts.push(`${contract.reward.credits.toLocaleString()} 📧`);
    if (contract.reward.stamps) parts.push(`${contract.reward.stamps} ⭐`);
    if (contract.reward.researchPoints) parts.push(`${contract.reward.researchPoints} 🧪`);
    return parts.join(', ');
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2 mb-2">
          <FileText className="w-6 h-6" />
          Contracts
        </h2>
        <p className="text-sm text-slate-400">
          Accept delivery missions to earn stamps, research points, and credits. Only one contract can be active at a time.
        </p>
        <div className="mt-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-cyan-900/30">
          <span className="text-xs text-slate-500 uppercase font-bold">Completed</span>
          <p className="text-xl font-mono text-emerald-400 flex items-center gap-1">
            <Award size={16} />
            {gameState.totalContractsCompleted}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {/* Active Contract */}
        {activeContract && gameState.activeContract && (
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-2 border-cyan-500/50 rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                <Award className="w-5 h-5" />
                {activeContract.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1">{activeContract.description}</p>
            </div>
            <button
              onClick={onAbandonContract}
              className="px-3 py-1 rounded-lg bg-red-900/50 hover:bg-red-900 border border-red-700 text-red-300 text-xs font-bold transition-colors"
            >
              Abandon
            </button>
          </div>

          {/* Time Remaining */}
          {getTimeRemaining() && (
            <div className="mb-3 flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="font-mono text-yellow-400">{getTimeRemaining()}</span>
            </div>
          )}

          {/* Objectives */}
          <div className="space-y-3 mb-4">
            {activeContract.objectives.map((obj, idx) => {
              const progress = getProgressValue(obj);
              const currentVal = getCurrentValue(obj);
              const isFailed = obj.type === 'NO_BUILDING' && progress === 0 && currentVal.startsWith('✗');

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={isFailed ? 'text-red-400' : 'text-slate-300'}>
                      {formatObjective(obj)}
                    </span>
                    <span className="font-mono text-cyan-300">
                      {currentVal} / {obj.targetValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFailed ? 'bg-red-500' : progress >= 100 ? 'bg-emerald-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rewards */}
          <div className="pt-3 border-t border-cyan-700/50">
            <div className="text-xs text-slate-400 mb-1">Rewards:</div>
            <div className="text-sm font-mono text-yellow-400">{formatReward(activeContract)}</div>
          </div>
        </div>
        )}

        {/* Available Contracts */}
        <div className="space-y-2">
          {!activeContract && availableContracts.length === 0 && (
            <div className="text-center text-slate-500 text-sm py-8">
              <p>No contracts available.</p>
              <p className="text-xs mt-2">Progress further to unlock more contracts!</p>
            </div>
          )}

          {!activeContract && availableContracts.map(contract => (
            <button
              key={contract.id}
              onClick={() => onActivateContract(contract.id)}
              className="w-full p-4 rounded-xl border text-left transition-all bg-slate-800 border-slate-600 hover:bg-slate-700 hover:border-cyan-500"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-cyan-200">{contract.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{contract.description}</p>
                </div>
                {contract.isRepeatable && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-900/50 border border-purple-700 text-purple-300 text-[10px] font-bold whitespace-nowrap">
                    REPEATABLE
                  </span>
                )}
              </div>

              {/* Objectives Preview */}
              <div className="space-y-1 mb-3">
                {contract.objectives.map((obj, idx) => (
                  <div key={idx} className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="text-cyan-500">•</span>
                    {formatObjective(obj)}
                  </div>
                ))}
              </div>

              {/* Rewards */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                <span className="text-xs text-slate-500">Rewards:</span>
                <span className="text-xs font-mono text-yellow-400">{formatReward(contract)}</span>
              </div>
            </button>
          ))}

          {activeContract && availableContracts.length > 0 && (
            <div className="text-center text-slate-500 text-sm py-4">
              <p>Complete or abandon current contract to accept a new one.</p>
              <p className="text-xs mt-2">{availableContracts.length} contract(s) available</p>
            </div>
          )}
        </div>

        {/* Completion History */}
        {gameState.completedContracts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4" />
              Completed Contracts ({gameState.completedContracts.length})
            </h4>
            <div className="space-y-1">
              {[...gameState.completedContracts].reverse().map(contractId => {
                const contract = getContractById(contractId);
                if (!contract) return null;
                return (
                  <div key={contractId} className="text-xs text-slate-500 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    {contract.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Failed Contracts */}
        {gameState.failedContracts.length > 0 && (
          <div className="pt-4 border-t border-slate-700">
            <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4" />
              Failed Contracts ({gameState.failedContracts.length})
            </h4>
            <div className="space-y-1">
              {[...gameState.failedContracts].reverse().map(contractId => {
                const contract = getContractById(contractId);
                if (!contract) return null;
                return (
                  <div key={contractId} className="text-xs text-slate-500 flex items-center gap-2">
                    <XCircle className="w-3 h-3 text-red-500" />
                    {contract.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
