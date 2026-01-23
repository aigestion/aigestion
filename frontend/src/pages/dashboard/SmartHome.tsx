import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LightBulbIcon,
    VideoCameraIcon,
    ThermometerIcon,
    PlusIcon,
    WifiIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import ConnectHA from '../../components/iot/Wizard/ConnectHA';
import LightCard from '../../components/iot/cards/LightCard';
import CameraCard from '../../components/iot/cards/CameraCard';
import SensorCard from '../../components/iot/cards/SensorCard';

const SmartHome = () => {
    const [devices, setDevices] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [showWizard, setShowWizard] = useState(false);

    // Load connection state on mount
    useEffect(() => {
        // Check if we have credentials (in a real app this would be more secure)
        const storedUrl = localStorage.getItem('ha_url');
        if (storedUrl) {
            setIsConnected(true);
            fetchDevices();
        }
    }, []);

    const fetchDevices = async () => {
        try {
            // Mock headers for demo - in real app use context or secure storage
            const url = localStorage.getItem('ha_url') || '';
            const token = localStorage.getItem('ha_token') || '';

            const res = await fetch('/api/iot/devices', {
                headers: { 'x-ha-url': url, 'x-ha-token': token }
            });
            const data = await res.json();
            if (data.success) {
                setDevices(data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleControl = async (domain: string, service: string, data: any) => {
        try {
            const url = localStorage.getItem('ha_url') || '';
            const token = localStorage.getItem('ha_token') || '';

            await fetch('/api/iot/control', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-ha-url': url,
                    'x-ha-token': token
                },
                body: JSON.stringify({ domain, service, serviceData: data })
            });

            // Optimistic update or refetch
            setTimeout(fetchDevices, 500);
        } catch (err) {
            console.error(err);
        }
    };

    const handleWizardSuccess = () => {
        setShowWizard(false);
        setIsConnected(true);
        fetchDevices();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <AnimatePresence>
                {showWizard && (
                    <ConnectHA
                        onSuccess={handleWizardSuccess}
                        onCancel={() => setShowWizard(false)}
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Smart Home Control
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your IoT ecosystem with God-level precision.</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
                    onClick={() => setShowWizard(true)}
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Device / Hub</span>
                </button>
            </div>

            {/* Connection Status */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-12 border border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        <WifiIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Home Assistant Hub</h3>
                        <p className="text-sm text-gray-400">{isConnected ? `Connected • ${devices.length} Devices Synced` : 'Disconnected'}</p>
                    </div>
                </div>
                {!isConnected && (
                    <button
                        onClick={() => setShowWizard(true)}
                        className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                        Connect Now
                    </button>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Lights */}
                {(devices.some(d => d.entity_id.startsWith('light.')) || !isConnected) && (
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <LightBulbIcon className="w-6 h-6 text-yellow-400" />
                            <h2 className="text-2xl font-bold">Lights</h2>
                        </div>
                        <div className="space-y-4">
                            {isConnected ? (
                                devices.filter(d => d.entity_id.startsWith('light.')).map(device => (
                                    <LightCard key={device.entity_id} device={device} onControl={handleControl} />
                                ))
                            ) : (
                                <div className="bg-gray-800/30 border border-gray-700 border-dashed rounded-xl p-8 text-center text-gray-500">
                                    No lights connected
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Cameras */}
                {(devices.some(d => d.entity_id.startsWith('camera.')) || !isConnected) && (
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <VideoCameraIcon className="w-6 h-6 text-blue-400" />
                            <h2 className="text-2xl font-bold">Cameras</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {isConnected ? (
                                devices.filter(d => d.entity_id.startsWith('camera.')).map(device => (
                                    <CameraCard key={device.entity_id} device={device} onControl={handleControl} />
                                ))
                            ) : (
                                <div className="bg-gray-800/30 border border-gray-700 border-dashed rounded-xl p-8 text-center text-gray-500">
                                    No cameras connected
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Sensors & Climate */}
                {(devices.some(d => d.entity_id.startsWith('sensor.') || d.entity_id.startsWith('climate.')) || !isConnected) && (
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <ThermometerIcon className="w-6 h-6 text-red-400" />
                            <h2 className="text-2xl font-bold">Climate & Sensors</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {isConnected ? (
                                devices.filter(d => d.entity_id.startsWith('sensor.') || d.entity_id.startsWith('climate.')).map(device => (
                                    <SensorCard key={device.entity_id} device={device} />
                                ))
                            ) : (
                                <div className="col-span-2 bg-gray-800/30 border border-gray-700 border-dashed rounded-xl p-8 text-center text-gray-500">
                                    No sensors connected
                                </div>
                            )}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default SmartHome;
