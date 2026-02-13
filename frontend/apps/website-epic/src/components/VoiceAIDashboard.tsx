/**
 * Voice AI Dashboard Component
 * Provides UI for managing voice AI services (ElevenLabs, Vapi, Twilio)
 */

import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Volume2,
  Play,
  Download,
  Settings,
  BarChart3,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';

import {
  voiceAIIntegration,
  VoiceMessage,
  VoiceCallSession,
  VoiceAIConfig,
} from '../services/voice-ai-integration';

interface SystemStats {
  elevenLabs: { voicesAvailable: number };
  vapi: { assistantsCount: number; activeCalls: number };
  twilio: { phoneNumbersCount: number; accountStatus: string };
  integration: { activeSessions: number; totalMessages: number };
}

const VoiceAIDashboard: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [activeSessions, setActiveSessions] = useState<VoiceCallSession[]>([]);
  const [textToConvert, setTextToConvert] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    initializeVoiceAI();
    loadSystemStats();
    loadActiveSessions();

    const interval = setInterval(() => {
      loadActiveSessions();
      loadSystemStats();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const initializeVoiceAI = async () => {
    try {
      setIsLoading(true);
      await voiceAIIntegration.initialize();
      setIsInitialized(true);
      setSuccess('✅ Voice AI System initialized successfully');
    } catch (error) {
      setError(
        `❌ Failed to initialize Voice AI: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadSystemStats = async () => {
    try {
      const stats = await voiceAIIntegration.getSystemStats();
      setSystemStats(stats);
    } catch (error) {
      console.error('Error loading system stats:', error);
    }
  };

  const loadActiveSessions = () => {
    const sessions = voiceAIIntegration.getActiveSessions();
    setActiveSessions(sessions);
  };

  const handleTextToSpeech = async () => {
    if (!textToConvert.trim()) {
      setError('Please enter text to convert');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const voiceMessage = await voiceAIIntegration.textToSpeech(textToConvert);
      setVoiceMessages(prev => [voiceMessage, ...prev]);
      setSuccess('✅ Text converted to speech successfully');
      setTextToConvert('');
    } catch (error) {
      setError(
        `❌ Failed to convert text to speech: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCall = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const session = await voiceAIIntegration.startVoiceCall(phoneNumber);
      setSuccess(`✅ Call started to ${phoneNumber}`);
      setPhoneNumber('');
      loadActiveSessions();
    } catch (error) {
      setError(
        `❌ Failed to start call: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCall = async (sessionId: string) => {
    try {
      setIsLoading(true);
      await voiceAIIntegration.endSession(sessionId);
      setSuccess('✅ Call ended successfully');
      loadActiveSessions();
    } catch (error) {
      setError(
        `❌ Failed to end call: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVoice = async (voiceMessage: VoiceMessage) => {
    try {
      setCurrentPlayingId(voiceMessage.id);
      await voiceAIIntegration.playVoiceMessage(voiceMessage);
      setCurrentPlayingId(null);
    } catch (error) {
      setError(
        `❌ Failed to play voice message: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setCurrentPlayingId(null);
    }
  };

  const handleDownloadVoice = (voiceMessage: VoiceMessage) => {
    try {
      voiceAIIntegration.downloadVoiceMessage(voiceMessage);
      setSuccess('✅ Voice message downloaded');
    } catch (error) {
      setError(
        `❌ Failed to download voice message: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const clearNotifications = () => {
    setError(null);
    setSuccess(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'in-progress':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'ended':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in-progress':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Voice AI Dashboard</h1>
                <p className="text-gray-600">Manage your voice AI services</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isInitialized ? (
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 rounded-full">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">Initializing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          {(error || success) && (
            <div
              className={`p-4 rounded-lg mb-4 flex items-center justify-between ${
                error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                {error ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <span className={error ? 'text-red-800' : 'text-green-800'}>
                  {error || success}
                </span>
              </div>
              <button onClick={clearNotifications} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* System Stats */}
          {systemStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">ElevenLabs</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {systemStats.elevenLabs.voicesAvailable}
                    </p>
                    <p className="text-purple-600 text-xs">Voices Available</p>
                  </div>
                  <Volume2 className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Vapi</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {systemStats.vapi.assistantsCount}
                    </p>
                    <p className="text-blue-600 text-xs">Assistants</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Twilio</p>
                    <p className="text-2xl font-bold text-green-900">
                      {systemStats.twilio.phoneNumbersCount}
                    </p>
                    <p className="text-green-600 text-xs">Phone Numbers</p>
                  </div>
                  <Phone className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Active Sessions</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {systemStats.integration.activeSessions}
                    </p>
                    <p className="text-orange-600 text-xs">Calls in Progress</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Text to Speech */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mic className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Text to Speech</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter text to convert
                </label>
                <textarea
                  value={textToConvert}
                  onChange={e => setTextToConvert(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Type your message here..."
                />
              </div>

              <button
                onClick={handleTextToSpeech}
                disabled={isLoading || !textToConvert.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Convert to Speech</span>
                  </>
                )}
              </button>
            </div>

            {/* Voice Messages */}
            {voiceMessages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Generated Voices</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {voiceMessages.map(message => (
                    <div
                      key={message.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{message.text}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePlayVoice(message)}
                          disabled={currentPlayingId === message.id}
                          className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                          {currentPlayingId === message.id ? (
                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDownloadVoice(message)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Phone Calls */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Voice Calls</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              <button
                onClick={handleStartCall}
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Starting...</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4" />
                    <span>Start Voice Call</span>
                  </>
                )}
              </button>
            </div>

            {/* Active Sessions */}
            {activeSessions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Active Sessions</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {activeSessions.map(session => (
                    <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(session.status)}
                          <span className="text-sm font-medium text-gray-900">
                            {session.phoneNumber}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(session.status)}`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Started: {new Date(session.startTime).toLocaleTimeString()}</span>
                        {(session.status === 'active' || session.status === 'in-progress') && (
                          <button
                            onClick={() => handleEndCall(session.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                          >
                            <PhoneOff className="w-3 h-3" />
                            <span>End Call</span>
                          </button>
                        )}
                      </div>
                      {session.duration && (
                        <div className="text-xs text-gray-500 mt-1">
                          Duration: {Math.floor(session.duration / 60)}m {session.duration % 60}s
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={initializeVoiceAI}
              disabled={isLoading}
              className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-blue-100 transition-all duration-200"
            >
              <Activity className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Reinitialize System</p>
              <p className="text-xs text-gray-600">Reset and reconnect all services</p>
            </button>

            <button
              onClick={loadSystemStats}
              className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200"
            >
              <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Refresh Stats</p>
              <p className="text-xs text-gray-600">Update system statistics</p>
            </button>

            <button
              onClick={() => {
                setVoiceMessages([]);
                setActiveSessions([]);
              }}
              className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-red-100 transition-all duration-200"
            >
              <XCircle className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Clear History</p>
              <p className="text-xs text-gray-600">Clear messages and sessions</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAIDashboard;
