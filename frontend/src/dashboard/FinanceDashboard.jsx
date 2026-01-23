/**
 * 🛡️ AIGestion.net Nexus Finance Module
 * © 2026 Alejandro Manuel Alfonso Fernández (DNI: 28921591B). Proprietary & Restricted.
 * SHA-256 Auth Signature: NEXUS-FINANCE-GOD-MODE-v1.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import { useWallet } from '../hooks/useWallet';
import { CHAINS } from '../config/chains';
import PortfolioChart from '../components/PortfolioChart';

export const FinanceDashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [balances, setBalances] = useState({});
  const [showSendModal, setShowSendModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [txForm, setTxForm] = useState({ to: '', amount: '' });
  const [selectedChainKey, setSelectedChainKey] = useState('ETHEREUM');
  // Token Management
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [activeWalletId, setActiveWalletId] = useState(null);
  const [tokenForm, setTokenForm] = useState({ contractAddress: '', chainId: '1' });
  const [prices, setPrices] = useState({});
  const [historyData, setHistoryData] = useState([]);

  const {
    account,
    chainId,
    connectWallet,
    isConnected,
    isConnecting,
    sendTransaction,
    switchNetwork,
  } = useWallet();

  // Estados para el formulario de nueva wallet
  const [newWallet, setNewWallet] = useState({
    type: 'safepal',
    address: '',
    label: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Datos mock para la estética inicial si no hay wallets
  const mockTransactions = [
    { id: 1, type: 'Transfer', amount: '+0.45 ETH', status: 'Completed', date: '2026-01-11' },
    { id: 2, type: 'Swap', amount: '-120.00 USDT', status: 'Pending', date: '2026-01-10' },
    { id: 3, type: 'Staking', amount: '+12.40 SOL', status: 'Completed', date: '2026-01-08' },
  ];

  useEffect(() => {
    fetchWallets();
    fetchBalances();
    fetchTransactions();
    fetchPrices();
  }, []);

  // Poll prices every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-fill address if connected and selecting metamask
  useEffect(() => {
    if (isConnected && account && (newWallet.type === 'metamask' || newWallet.type === 'trust')) {
      setNewWallet(prev => ({ ...prev, address: account }));
    }
  }, [isConnected, account, newWallet.type]);

  // Sync selected chain with wallet chainId
  useEffect(() => {
    if (chainId) {
      const key = Object.keys(CHAINS).find(k => CHAINS[k].chainId === chainId);
      if (key) setSelectedChainKey(key);
    }
  }, [chainId]);

  useEffect(() => {
    if (Object.keys(balances).length > 0) {
        fetchHistory();
    }
  }, [balances]);

  useEffect(() => {
    if (Object.keys(balances).length > 0) {
        fetchHistory();
    }
  }, [balances]);

  const handleNetworkChange = async key => {
    setSelectedChainKey(key);
    if (isConnected) {
      try {
        await switchNetwork(CHAINS[key].chainId);
      } catch (error) {
        console.error(error);
        toast.error('Error cambiando de red');
      }
    }
  };

  const handleOpenTokenModal = (walletId) => {
    setActiveWalletId(walletId);
    setTokenForm({
      contractAddress: '',
      chainId: chainId || CHAINS[selectedChainKey].chainId // Default to current chain
    });
    setShowTokenModal(true);
  };

  const handleAddToken = async () => {
    if (!tokenForm.contractAddress) {
      toast.error('La dirección del contrato es obligatoria');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiService.finance.addToken(activeWalletId, {
        contractAddress: tokenForm.contractAddress,
        chainId: parseInt(tokenForm.chainId, 16)
      });
      toast.success('Token agregado y rastreando balances...');
      setShowTokenModal(false);
      fetchBalances();
    } catch (error) {
      console.error(error);
      toast.error('Error al agregar token');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchWallets = async () => {
    try {
      const response = await apiService.finance.getWallets();
      if (
        response.data.status === 200 ||
        response.data.status === 'success' ||
        (response.data.data && Array.isArray(response.data.data))
      ) {
        // El backend devuelve { status: 200, data: [...] } o similar dependiendo de buildResponse
        setWallets(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
      toast.error('Error al cargar billeteras');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async () => {
    try {
      const response = await apiService.finance.getBalances();
      if (response.data && response.data.data) {
        setBalances(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const fetchTransactions = async () => {
    if (wallets.length === 0) return;

    try {
        const allTxs = [];
        // Fetch for all wallets
        for (const w of wallets) {
            // Determine chainId for this wallet (default to Ethereum Mainnet 1 if not specified or derived from selectedChain)
            // For now, let's use the selectedChainKey to determine context, or default to 1
            const chainId = CHAINS[selectedChainKey]?.chainId || 1;
            const response = await apiService.transactions.getHistory(w.address, chainId);
            if (response.data && response.data.data) {
                allTxs.push(...response.data.data);
            }
        }

        // Sort by timestamp desc
        const sorted = allTxs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
        setTransactions(sorted);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchPrices = async () => {
    try {
      // Hardcoded list of IDs for now + we could dynamically add tracked tokens if mapped
      // For MVP: ethereum, matic-network, binancecoin, tether, uniswap, etc.
      const ids = ['ethereum', 'matic-network', 'binancecoin'];
      const response = await apiService.finance.getPrices(ids);
      if (response.data && response.data.data) {
        setPrices(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const getPrice = (symbol) => {
    const map = {
      'ETH': 'ethereum',
      'MATIC': 'matic-network',
      'BNB': 'binancecoin',
      // 'USDT': 'tether' // Example
    return prices[id] || 0;
  };

  const getPrice = (symbol) => {
    const map = {
      'ETH': 'ethereum',
      'MATIC': 'matic-network',
      'BNB': 'binancecoin',
      // 'USDT': 'tether' // Example
    };
    const id = map[symbol];
    const data = prices[id];
    if (!data) return 0;
    // Handle new object structure { usd, change }
    return typeof data === 'object' ? data.usd : data;
  };

  const get24hChange = (symbol) => {
    const map = {
        'ETH': 'ethereum',
        'MATIC': 'matic-network',
        'BNB': 'binancecoin',
    };
    const id = map[symbol];
    const data = prices[id];
    if (!data || typeof data !== 'object') return 0;
    return data.change || 0;
  };

  const fetchPrices = async () => {
    try {
      // Hardcoded list of IDs for now + we could dynamically add tracked tokens if mapped
      // For MVP: ethereum, matic-network, binancecoin, tether, uniswap, etc.
      const ids = ['ethereum', 'matic-network', 'binancecoin'];
      const response = await apiService.finance.getPrices(ids);
      if (response.data && response.data.data) {
        setPrices(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const [gasStats, setGasStats] = useState({ totalGasEth: 0 });

  const fetchGasStats = async () => {
    if (wallets.length === 0) return;
    try {
        let total = 0;
        for (const w of wallets) {
            const chainId = CHAINS[selectedChainKey]?.chainId || 1;
            const res = await apiService.finance.getGasStats(w.address, chainId);
            if (res.data && res.data.data) {
                total += res.data.data.totalGasEth;
            }
        }
        setGasStats({ totalGasEth: total });
    } catch (error) {
        console.error('Error fetching gas stats:', error);
    }
  };

  useEffect(() => {
    if (wallets.length > 0) {
        fetchGasStats();
    }
  }, [wallets, selectedChainKey]);

  const getPrice = (symbol) => {
    const map = {
      'ETH': 'ethereum',
      'MATIC': 'matic-network',
      'BNB': 'binancecoin',
      // 'USDT': 'tether' // Example
    };
    const id = map[symbol];
    return prices[id] || 0;
  };

  const fetchHistory = async () => {
    // 1. Identify assets
    // Simplified: ETH, MATIC, BNB + tokens if we had mapping
    const ids = ['ethereum', 'matic-network', 'binancecoin'];

    try {
        const response = await apiService.finance.getHistory(ids, 7);
        if (response.data && response.data.data) {
            const rawHistory = response.data.data;
            // 2. Aggregate
            // We need to map dates. Assuming all arrays have same length/dates for simplicity of MVP
            // Master date list from ethereum
            if (!rawHistory['ethereum']) return;

            const dates = rawHistory['ethereum'].map(item => {
                // Sanitize date string to prevent selector injection
                // We only allow alphanumeric, hyphens, colons, and basic date/time chars
                return (item.date || '').replace(/["'[\]]/g, '');
            });
            const chartData = dates.map(date => {
                let totalValue = 0;

                // For each wallet
                Object.values(balances).forEach(walletBals => {
                    if (!walletBals) return;

                    // Native ETH (ethereum)
                    if (walletBals['ETH']) {
                         const priceObj = rawHistory['ethereum']?.find(i => i.date === date);
                         if (priceObj) totalValue += parseFloat(walletBals['ETH']) * priceObj.price;
                    }
                     // Native MATIC (matic-network)
                     if (walletBals['MATIC']) {
                        const priceObj = rawHistory['matic-network']?.find(i => i.date === date);
                        if (priceObj) totalValue += parseFloat(walletBals['MATIC']) * priceObj.price;
                    }
                    // Native BNB (binancecoin)
                    if (walletBals['BNB']) {
                        const priceObj = rawHistory['binancecoin']?.find(i => i.date === date);
                        if (priceObj) totalValue += parseFloat(walletBals['BNB']) * priceObj.price;
                    }
                });

                return { date, value: totalValue };
            });
            setHistoryData(chartData);
        }
    } catch (error) {
        console.error('Error fetching history:', error);
    }
  };

  const handleSend = async () => {
    if (!txForm.to || !txForm.amount) {
      toast.error('Completa todos los campos');
      return;
    }
    setIsSubmitting(true);
    try {
      const txHash = await sendTransaction({ to: txForm.to, value: txForm.amount });
      toast.success(`Transacción enviada: ${txHash.slice(0, 10)}...`);

      // Log to backend
      await apiService.transactions.log({
        hash: txHash,
        from: account,
        to: txForm.to,
        value: txForm.amount,
        chainId: 1, // Defaulting to mainnet/testnet ID for now, should come from chainId state
        status: 'pending',
      });

      setShowSendModal(false);
      setTxForm({ to: '', amount: '' });
      fetchTransactions(); // Refresh history
    } catch (error) {
      console.error(error);
      toast.error('Error al enviar transacción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddWallet = async () => {
    if (!newWallet.address) {
      toast.error('La dirección es obligatoria');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await apiService.finance.updateWallet(editingWalletId, newWallet);
        toast.success('¡Wallet actualizada con éxito!');
      } else {
        await apiService.finance.createWallet(newWallet);
        toast.success('¡Wallet conectada con éxito!');
      }
      setShowAddModal(false);
      setIsEditing(false);
      setEditingWalletId(null);
      setNewWallet({ type: 'safepal', address: '', label: '' });
      fetchWallets(); // Recargar lista
    } catch (error) {
      console.error('Error saving wallet:', error);
      toast.error('Error al guardar la billetera');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = wallet => {
    setNewWallet({
      type: wallet.type,
      address: wallet.address,
      label: wallet.label || '',
    });
    setEditingWalletId(wallet._id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleDeleteWallet = async id => {
    if (!window.confirm('¿Estás seguro de eliminar esta billetera?')) return;

    try {
      await apiService.finance.deleteWallet(id);
      toast.success('Billetera eliminada');
      fetchWallets();
    } catch (error) {
      console.error('Error deleting wallet:', error);
      toast.error('Error al eliminar');
    }
  };

  const handleConnect = async () => {
    const connectedAccount = await connectWallet();
    if (connectedAccount) {
      setNewWallet(prev => ({ ...prev, address: connectedAccount }));
      toast.success('Billetera de navegador conectada');
    }
  };

  const handleExport = async () => {
    if (wallets.length === 0) return;
    try {
        // Simplified: Export for the first active wallet or loop?
        // Let's export for the first one for MVP or currently selected context (which we don't strictly have deep in state yet)
        const wallet = wallets[0];
        const chainId = CHAINS[selectedChainKey]?.chainId || 1;

        const response = await apiService.finance.export(wallet.address, chainId);

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions_${wallet.address}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('CSV descargado');
    } catch (error) {
        console.error('Export failed:', error);
        toast.error('Error al exportar CSV');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Header con estadísticas rápidas God-Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20 p-8 rounded-[32px] border border-white/10 shadow-2xl text-white relative overflow-hidden group glass-pro">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
            Patrimonio Neto Estándar Nexus
          </p>
          <h3 className="text-5xl font-black mt-4 tracking-tighter text-glow-primary">
            ${Object.values(balances)
              .reduce((acc, walletBals) => {
                let walletTotal = 0;
                if (walletBals) {
                    Object.entries(walletBals).forEach(([symbol, amount]) => {
                        const price = getPrice(symbol);
                        const val = parseFloat(amount) || 0;
                        walletTotal += val * price;
                    });
                }
                return acc + walletTotal;
              }, 0)
              .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <span>🌐 Global Estimation (USD)</span>
          </div>
          {/* Network Selector in Header */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* 24h Change Badge */}
            <div className="bg-black/30 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1">
                {(() => {
                    // Estimate weighted average change? Or just ETH change as proxy?
                    // Let's use ETH as proxy for market sentiment for now
                    const ethChange = get24hChange('ETH');
                    const isPositive = ethChange >= 0;
                    return (
                        <>
                            <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                                {isPositive ? '▲' : '▼'} {Math.abs(ethChange).toFixed(2)}%
                            </span>
                        </>
                    )
                })()}
            </div>

            {Object.keys(CHAINS).map(key => (
              <button
                key={key}
                onClick={() => handleNetworkChange(key)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${selectedChainKey === key ? 'bg-white text-blue-600' : 'bg-white/20 text-white hover:bg-white/40'}`}
                title={CHAINS[key].chainName}
              >
                {CHAINS[key].nativeCurrency.symbol[0]}
              </button>
            ))}
          </div>
          {/* Chart Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30 pointer-events-none">
            <PortfolioChart data={historyData} />
          </div>
        </div>

        <div className="glass-card p-8 rounded-[32px] border-white/5 group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
            Wallets Activas
          </p>
          <div className="flex items-end justify-between mt-4">
            <h3 className="text-5xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">{wallets.length}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-12 h-12 glass rounded-2xl flex items-center justify-center hover:bg-primary hover:text-black transition-all shadow-lg"
                title="Añadir Wallet"
              >
                ➕
              </button>
              <button
                onClick={() => setShowSendModal(true)}
                className="w-12 h-12 glass rounded-2xl flex items-center justify-center hover:bg-success hover:text-black transition-all shadow-lg"
                title="Enviar Fondos"
              >
                💸
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Seguridad Nexus</p>
          <div className="flex items-center gap-5 mt-6">
            <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center text-2xl border border-success/20 shadow-lg shadow-success/10">
              🛡️
            </div>
            <div>
              <p className="text-sm font-black text-white px-2 py-1 bg-success/10 border border-success/20 rounded-lg w-fit">
                PROTECCIÓN ACTIVA
              </p>
              <p className="text-[10px] font-bold text-text-muted mt-2 tracking-widest uppercase">Cifrado AES-256-GCM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Wallets */}
      <div>
        <div className="flex items-center justify-between mb-6 px-2">
          <h4 className="text-xl font-black tracking-tighter">Mis Billeteras</h4>
          <span className="text-[10px] uppercase font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
            Sincronizado vía Backend Seguro
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <span className="animate-pulse text-gray-400 font-bold">
              Cargando orbes financieros...
            </span>
          </div>
        ) : wallets.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center px-4">
            <div className="text-4xl mb-4">🏦</div>
            <h5 className="font-bold text-gray-400">No tienes wallets configuradas</h5>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Comienza conectando tu cuenta para gestionar tus activos.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all font-sans"
            >
              Añadir Primera Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wallets.map(w => (
              <div
                key={w._id}
                className="glass-card rounded-[32px] border-white/5 p-8 group relative"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none" />
                <button
                  onClick={() => handleDeleteWallet(w._id)}
                  className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 p-2.5 text-red-400 hover:bg-red-400/10 rounded-xl transition-all z-10"
                  title="Eliminar wallet"
                >
                  🗑️
                </button>
                <button
                  onClick={() => handleEditClick(w)}
                  className="absolute top-6 right-16 opacity-0 group-hover:opacity-100 p-2.5 text-primary hover:bg-primary/10 rounded-xl transition-all z-10"
                  title="Editar wallet"
                >
                  ✏️
                </button>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-500">
                    {w.type === 'safepal' ? '🛡️' : w.type === 'metamask' ? '🦊' : '🔷'}
                  </div>
                  <span className="text-[10px] font-black uppercase text-primary/60 bg-primary/5 border border-primary/20 px-3 py-1 rounded-full tracking-widest italic">
                    {w.type}
                  </span>
                </div>
                <h5 className="font-bold text-lg text-white truncate pr-20">
                  {w.label || 'Billetera Principal'}
                </h5>
                <p className="text-[10px] font-mono text-text-muted mt-2 truncate bg-white/5 py-1 px-2 rounded w-fit">{w.address}</p>
                <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs font-black">
                        {balances[w.address]?.[CHAINS[selectedChainKey].nativeCurrency.symbol]
                        ? `${parseFloat(balances[w.address][CHAINS[selectedChainKey].nativeCurrency.symbol]).toFixed(4)} ${CHAINS[selectedChainKey].nativeCurrency.symbol}`
                        : '---'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                        ${((parseFloat(balances[w.address]?.[CHAINS[selectedChainKey].nativeCurrency.symbol] || 0) * getPrice(CHAINS[selectedChainKey].nativeCurrency.symbol)).toFixed(2))}
                    </span>
                  </div>
                  <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">
                    Detalles →
                  </button>
                </div>

                {/* Token List */}
                <div className="mt-4 border-t border-gray-50 dark:border-gray-800 pt-2 text-left">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tokens Rastreados</span>
                        <button
                            onClick={() => handleOpenTokenModal(w._id)}
                            className="text-[10px] bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 px-2 py-1 rounded-md text-blue-600 transition-colors"
                        >
                            + Add
                        </button>
                    </div>
                    <div className="space-y-1">
                        {balances[w.address] && Object.entries(balances[w.address])
                          .filter(([symbol]) => !['ETH', 'MATIC', 'BNB'].includes(symbol)) // Show only non-native? Or all? Let's show non-native here.
                          .map(([symbol, balance]) => (
                            <div key={symbol} className="flex justify-between text-xs items-center">
                                <span className="font-medium text-gray-600 dark:text-gray-300">{symbol}</span>
                                <div className="text-right">
                                    <span className="font-mono block">{parseFloat(balance).toFixed(4)}</span>
                                    <span className="text-[9px] text-gray-400 font-bold block">
                                        ${(parseFloat(balance) * getPrice(symbol)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!balances[w.address] || Object.keys(balances[w.address]).filter(s => !['ETH', 'MATIC', 'BNB'].includes(s)).length === 0) && (
                            <p className="text-[9px] text-gray-300 italic">No hay tokens activos</p>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Asset Allocation God-Level */}
          <div className="glass-card p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <h4 className="text-lg font-black tracking-tight mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
                Distribución de Activos Nexus
             </h4>
             <div className="h-64 flex items-center justify-center">
                {/* Simple Bar representation for MVP instead of importing Recharts Pie to verify dependencies first */}
                <div className="w-full space-y-4">
                    {Object.entries(balances)
                        .flatMap(([_, vals]) => Object.entries(vals))
                        .reduce((acc, [symbol, amount]) => {
                             const existing = acc.find(x => x.symbol === symbol);
                             if (existing) existing.amount += parseFloat(amount);
                             else acc.push({ symbol, amount: parseFloat(amount) });
                             return acc;
                        }, [])
                        .filter(x => x.amount > 0)
                        .map(item => {
                            const price = getPrice(item.symbol);
                            const value = item.amount * price;
                             return { ...item, value };
                        })
                        .sort((a, b) => b.value - a.value)
                        .map((asset, idx, arr) => {
                             const totalVal = arr.reduce((sum, x) => sum + x.value, 0);
                             const percent = totalVal > 0 ? (asset.value / totalVal) * 100 : 0;
                             return (
                                 <div key={asset.symbol}>
                                     <div className="flex justify-between text-xs font-bold mb-1">
                                         <span>{asset.symbol}</span>
                                         <span>{percent.toFixed(1)}%</span>
                                     </div>
                                     <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                         <div
                                            className="h-full bg-blue-500"
                                            style={{ width: `${percent}%`, backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899'][idx % 3] }}
                                         />
                                     </div>
                                 </div>
                             );
                        })
                    }
                </div>
             </div>
          </div>

          {/* Gas Analytics God-Level */}
          <div className="glass-card p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
             <h4 className="text-lg font-black tracking-tight mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-accent rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                Gas Fee Tracker // Nexus Realtime
             </h4>
             <div className="mt-8 relative z-10">
                 <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Gasto Acumulado en Comisiones</p>
                 <div className="flex items-baseline gap-3 mt-4">
                     <span className="text-5xl font-black tracking-tighter text-white text-glow-accent">
                         {gasStats.totalGasEth.toFixed(4)}
                     </span>
                     <span className="text-sm font-bold text-accent tracking-[0.2em] uppercase">ETH</span>
                 </div>
                 <div className="mt-8 p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-3">
                    <span className="w-2 h-2 bg-accent rounded-full animate-ping" />
                    <p className="text-[10px] text-accent font-black uppercase tracking-widest">
                       Optimización de gas activa vía SIMA
                    </p>
                 </div>
             </div>
          </div>
       </div>

      {/* Transacciones Recientes God-Level */}
      <div className="glass-card p-10 rounded-[40px] border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="flex items-center justify-between mb-10">
            <h4 className="text-xl font-black tracking-tight flex items-center gap-3">
               <span className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
               Historial de Transacciones Nexus
            </h4>
            <button
                onClick={handleExport}
                className="flex items-center gap-3 px-6 py-3 glass hover:bg-white/10 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all border border-white/5"
            >
                <span>💾 Exportar CSV</span>
            </button>
        </div>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay transacciones recientes.</p>
          ) : (
            transactions.map(tx => {
                const isOutbound = wallets.some(w => w.address.toLowerCase() === tx.from.toLowerCase());
                return (
              <div
                key={tx.hash}
                className="flex items-center justify-between p-6 glass-card rounded-2xl transition-all cursor-pointer group hover:scale-[1.01] border-white/5 mb-4"
                onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg ${isOutbound ? 'bg-error/10 text-error border border-error/20' : 'bg-success/10 text-success border border-success/20'}`}>
                    {isOutbound ? '📤' : '📥'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{isOutbound ? 'TRANSFERENCIA ENVIADA' : 'DEPÓSITO RECIBIDO'}</p>
                    <p className="text-[10px] text-text-muted font-bold tracking-[0.2em] mt-2 uppercase">
                      {new Date(tx.timestamp).toLocaleDateString()} // {new Date(tx.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black tracking-tighter ${isOutbound ? 'text-white' : 'text-glow-success'}`}>
                    {isOutbound ? '-' : '+'}{parseFloat(tx.value).toFixed(4)} <span className="text-xs text-text-muted font-bold ml-1">ETH</span>
                  </p>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-end gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'completed' ? 'bg-success' : 'bg-accent animate-pulse'}`} />
                    <span className={tx.status === 'completed' ? 'text-success' : 'text-accent'}>{tx.status}</span>
                  </div>
                </div>
              </div>
            )})
          )}
        </div>
      </div>

      {/* Modal para Añadir Wallet */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-white/30 dark:bg-black/30">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md p-10 rounded-[40px] shadow-2xl border border-white dark:border-gray-800 relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center hover:rotate-90 transition-transform"
              >
                ✕
              </button>
              <h3 className="text-3xl font-black tracking-tighter mb-2">
                {isEditing ? 'Editar Wallet' : 'Conectar Wallet'}
              </h3>
              <p className="text-gray-400 text-sm mb-8 font-medium">
                {isEditing
                  ? 'Actualiza los detalles de tu conexión.'
                  : 'Gestiona tus finanzas con seguridad industrial.'}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">
                    Etiqueta (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newWallet.label}
                    onChange={e => setNewWallet({ ...newWallet, label: e.target.value })}
                    placeholder="Ej: Ahorros Fríos"
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none focus:ring-2 ring-blue-500 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">
                    Tipo de Wallet
                  </label>
                  <select
                    value={newWallet.type}
                    onChange={e => setNewWallet({ ...newWallet, type: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none focus:ring-2 ring-blue-500 font-bold text-sm appearance-none"
                  >
                    <option value="safepal">Safepal (🛡️ Recomendado)</option>
                    <option value="metamask">MetaMask (🦊)</option>
                    <option value="trust">Trust Wallet (🔷)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">
                    Dirección Pública
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newWallet.address}
                      onChange={e => setNewWallet({ ...newWallet, address: e.target.value })}
                      placeholder="0x000..."
                      readOnly={newWallet.type === 'metamask' || newWallet.type === 'trust'}
                      className={`w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none focus:ring-2 ring-blue-500 font-bold text-sm ${newWallet.type !== 'safepal' ? 'pr-12 cursor-not-allowed opacity-70' : ''}`}
                    />
                    {(newWallet.type === 'metamask' || newWallet.type === 'trust') && (
                      <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-transform"
                      >
                        {isConnecting ? '...' : '🦊'}
                      </button>
                    )}
                  </div>
                  {(newWallet.type === 'metamask' || newWallet.type === 'trust') &&
                    !newWallet.address && (
                      <p className="text-[10px] text-orange-500 font-bold mt-2 ml-2">
                        * Pulsa el zorro para sincronizar
                      </p>
                    )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleAddWallet}
                    disabled={isSubmitting || (!newWallet.address && newWallet.type !== 'safepal')}
                    className="w-full bg-blue-600 text-white p-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/40 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                  >
                    {isSubmitting
                      ? 'Sincronizando...'
                      : isEditing
                        ? 'Guardar Cambios'
                        : 'Confirmar Guardado Seguro'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Modal para Enviar Fondos */}
      <AnimatePresence>
        {showSendModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-white/30 dark:bg-black/30">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md p-10 rounded-[40px] shadow-2xl border border-white dark:border-gray-800 relative"
            >
              <button
                onClick={() => setShowSendModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center hover:rotate-90 transition-transform"
              >
                ✕
              </button>
              <h3 className="text-3xl font-black tracking-tighter mb-2">Enviar Fondos</h3>
              <p className="text-gray-400 text-sm mb-8 font-medium">
                Transfiere cripto de forma segura.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">
                    Destinatario (Address)
                  </label>
                  <input
                    type="text"
                    value={txForm.to}
                    onChange={e => setTxForm({ ...txForm, to: e.target.value })}
                    placeholder="0x..."
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none focus:ring-2 ring-green-500 font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">
                    Cantidad (ETH)
                  </label>
                  <input
                    type="number"
                    value={txForm.amount}
                    onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
                    placeholder="0.0"
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none focus:ring-2 ring-green-500 font-bold text-sm"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSend}
                    disabled={isSubmitting || !isConnected}
                    className="w-full bg-green-600 text-white p-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-green-700 shadow-xl shadow-green-500/40 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enviando...' : 'Confirmar Envío'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      {/* Modal para Añadir Token */}
      <AnimatePresence>
        {showTokenModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-white/30 dark:bg-black/30">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md p-10 rounded-[40px] shadow-2xl border border-white dark:border-gray-800 relative"
            >
              <button
                onClick={() => setShowTokenModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center hover:rotate-90 transition-transform"
              >
                ✕
              </button>
              <h3 className="text-3xl font-black tracking-tighter mb-2">Rastrear Token</h3>
              <p className="text-gray-400 text-sm mb-8 font-medium">
                Añade contratos ERC-20/BEP-20 para ver tus balances.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">
                    Dirección del Contrato
                  </label>
                  <input
                    type="text"
                    value={tokenForm.contractAddress}
                    onChange={e => setTokenForm({ ...tokenForm, contractAddress: e.target.value })}
                    placeholder="0x..."
                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none focus:ring-2 ring-blue-500 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">
                    Red (Chain)
                  </label>
                  <select
                     value={tokenForm.chainId}
                     onChange={e => setTokenForm({ ...tokenForm, chainId: e.target.value })}
                     className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border-none focus:ring-2 ring-blue-500 font-bold text-sm appearance-none"
                  >
                     {Object.values(CHAINS).map(chain => (
                         <option key={chain.chainId} value={chain.chainId}>
                             {chain.chainName}
                         </option>
                     ))}
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleAddToken}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white p-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/40 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Buscando...' : 'Añadir Token'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
