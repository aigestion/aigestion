import React from 'react';
import { motion } from 'framer-motion';
import { Watch, Smartphone, QrCode } from 'lucide-react';
import { NeonCard } from './NeonCard';

export const WearableBridge: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NeonCard title="DISPOSITIVOS_SYNC" accentColor="rgba(255, 255, 255, 0.4)">
                <div className="space-y-6">
                    {[
                        { icon: Watch, label: 'Apple Watch Series 9', status: 'SYNCED', user: 'Admin' },
                        { icon: Smartphone, label: 'iPad Pro Nexus', status: 'IDLE', user: 'Ventas' },
                        { icon: Watch, label: 'Garmin Fenix 7', status: 'LOW_BATTERY', user: 'Daniela' }
                    ].map((dev, i) => (
                        <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <dev.icon size={20} className="text-white/40" />
                                <div>
                                    <h6 className="text-[10px] font-bold text-white uppercase">{dev.label}</h6>
                                    <p className="text-[8px] text-nexus-silver/20 font-mono tracking-widest">{dev.user}</p>
                                </div>
                            </div>
                            <span className={`text-[8px] font-mono ${dev.status === 'SYNCED' ? 'text-green-400' : 'text-nexus-silver/20'}`}>
                                {dev.status}
                            </span>
                        </div>
                    ))}
                </div>
            </NeonCard>

            <NeonCard title="VINCULACIÓN_INSTANTÁNEA" accentColor="rgba(0, 245, 255, 0.3)">
                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-center mb-6 relative group cursor-pointer">
                        <QrCode size={48} className="text-nexus-cyan-glow group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-nexus-cyan/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
                    </div>
                    <p className="text-[9px] font-orbitron tracking-[0.3em] text-nexus-silver/40 uppercase leading-relaxed">
                        ESCANEA PARA VINCULAR<br />DISPOSITIVOS <span className="text-nexus-cyan-glow">AR / VR</span>
                    </p>
                    <div className="mt-6 flex gap-4">
                        <div className="text-[7px] font-mono px-3 py-1 rounded bg-white/5 text-nexus-silver/20 uppercase">AES-256_ENCRYPTED</div>
                        <div className="text-[7px] font-mono px-3 py-1 rounded bg-white/5 text-nexus-silver/20 uppercase">NFC_READY</div>
                    </div>
                </div>
            </NeonCard>
        </div>
    );
};
