import React, { useState } from 'react';
import { useDaniela } from '../DanielaProvider';

export const DanielaChat: React.FC = () => {
  const { state, sendMessage } = useDaniela();
  const [inputText, setInputText] = useState('');

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    await sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="daniela-chat">
      <div className="chat-messages">
        {state.messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-avatar">{message.sender === 'daniela' ? '🧠' : '👤'}</div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">{message.timestamp.toLocaleTimeString()}</div>
              {message.suggestions && (
                <div className="message-suggestions">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-btn"
                      onClick={() => setInputText(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {state.isTyping && (
          <div className="message daniela typing">
            <div className="message-avatar">🧠</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="message-input"
            disabled={state.isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || state.isTyping}
            className="send-button"
          >
            {state.isTyping ? '...' : '→'}
          </button>
        </div>
      </div>

      {state.error && (
        <div className="chat-error">
          <span className="error-icon">⚠️</span>
          {state.error}
        </div>
      )}
    </div>
  );
};
