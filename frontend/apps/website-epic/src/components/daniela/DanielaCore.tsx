import React from 'react';
import { DanielaProvider, useDaniela } from './DanielaProvider';
import { DanielaConfig } from './DanielaTypes';

interface DanielaCoreProps {
  config?: Partial<DanielaConfig>;
  className?: string;
  children?: React.ReactNode;
}

const DanielaCoreContent: React.FC<DanielaCoreProps> = ({ config, className = '', children }) => {
  const { state } = useDaniela();

  return (
    <div className={`daniela-core ${className}`}>
      <div className="daniela-container">
        {children || (
          <div className="daniela-default">
            <div className="daniela-status">
              <span
                className={`status-indicator ${state.isConnected ? 'connected' : 'disconnected'}`}
              >
                {state.isConnected ? '🟢 En línea' : '🟡 Modo demo'}
              </span>
            </div>
            <div className="daniela-messages">
              {state.messages.map(message => (
                <div key={message.id} className={`message ${message.sender}`}>
                  <strong>{message.sender === 'daniela' ? '🧠 Daniela' : '👤 Tú'}:</strong>
                  <p>{message.text}</p>
                  {message.suggestions && (
                    <div className="suggestions">
                      {message.suggestions.map((suggestion, index) => (
                        <button key={index} className="suggestion-btn">
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {state.isTyping && (
                <div className="message daniela typing">
                  <strong>🧠 Daniela:</strong>
                  <span className="typing-indicator">Escribiendo...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const DanielaCore: React.FC<DanielaCoreProps> = ({ config, className, children }) => {
  return (
    <DanielaProvider config={config}>
      <DanielaCoreContent config={config} className={className}>
        {children}
      </DanielaCoreContent>
    </DanielaProvider>
  );
};

export default DanielaCore;
