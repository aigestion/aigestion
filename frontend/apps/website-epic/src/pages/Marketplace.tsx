import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { PersonaCard } from '../components/PersonaCard';
import axios from 'axios';

export const Marketplace: React.FC = () => {
  const [personas, setPersonas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/personas/marketplace');
      setPersonas(response.data.data.personas || []);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch marketplace', err);
      setError('Failed to load marketplace. Ensure Nexus API is running.');
      setLoading(false);
    }
  };

  const handleHire = async (id: string) => {
    try {
      await axios.post(`/api/personas/hire/${id}`);
      // Refresh to update executions/hired status
      fetchMarketplace();
    } catch (err) {
      console.error('Hire failed', err);
    }
  };

  const filteredPersonas = personas.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-transparent p-8">
      <header className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Sparkles className="text-nexus-blue" size={32} />
          <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">
            Persona <span className="text-nexus-blue">Marketplace</span>
          </h1>
        </motion.div>
        <p className="text-white/50 max-w-2xl text-lg">
          Discover and hire sovereign AI personas with specialized knowledge and distinct personality traits for your Nexus Swarm.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
          <input
            type="text"
            placeholder="Search personas, expertise, tags..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-nexus-blue/50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/70 flex items-center gap-2 hover:bg-white/10 transition-colors">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nexus-blue"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4 text-red-500">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPersonas.map((persona) => (
            <PersonaCard
              key={persona._id}
              persona={{...persona, id: persona._id}}
              onHire={handleHire}
            />
          ))}

          {filteredPersonas.length === 0 && (
            <div className="col-span-full py-20 text-center text-white/30 border-2 border-dashed border-white/5 rounded-3xl">
              No personas found matching your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
