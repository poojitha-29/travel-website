import React, { useState, useRef, useEffect } from 'react';

const quickQuestions = [
  'Best honeymoon destinations?',
  'Is Bali good for 7 days?',
  'Can you customize packages?',
  'How much does Europe cost?',
  'Do you help with visas?',
];

const botReplies = {
  honeymoon: 'Popular honeymoon spots: Bali, Maldives, Switzerland, Dubai, Kerala. We customize based on your budget and dates.',
  bali: '7 days in Bali is perfect! Try 4 nights Ubud + 3 nights Seminyak or Gili Islands for the best experience.',
  customize: 'Yes! All our trips are fully customised — itinerary, budget, travel style, duration. Just WhatsApp us.',
  europe: 'A comfortable Europe trip is 10–14 days. Fewer cities = richer experience. Popular: Paris, Switzerland, Italy.',
  visa: 'Yes, we assist with tourist visas for Dubai, Europe, Singapore, Thailand and more.',
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m your travel assistant. Ask about destinations, packages or visas.' }
  ]);
  const [input, setInput] = useState('');
  const msgEndRef = useRef(null);

  useEffect(() => {
    if (open) msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const addMessage = text => {
    if (!text.trim()) return;
    const lower = text.toLowerCase();
    const replyKey = Object.keys(botReplies).find(k => lower.includes(k));
    const reply = replyKey ? botReplies[replyKey] : "I'm not fully sure about that. Let me connect you with our travel expert on WhatsApp!";
    if (!replyKey) {
      setTimeout(() => {
        window.open(`https://wa.me/918106868686?text=${encodeURIComponent(text)}`, '_blank');
      }, 1000);
    }
    setMessages(prev => [...prev, { from: 'user', text }, { from: 'bot', text: reply }]);
    setInput('');
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(v => !v)} aria-label="Chat">
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">✦</div>
              <div>
                <h4>Travel Assistant</h4>
                <p>Usually replies instantly</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.from}`}>{m.text}</div>
            ))}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
              {quickQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => addMessage(q)}
                  style={{ padding: '0.25rem 0.7rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--light-grey)', background: 'var(--cream)', color: 'var(--warm-grey)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' }}
                >
                  {q}
                </button>
              ))}
            </div>
            <div ref={msgEndRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMessage(input)}
              placeholder="Ask about trips…"
            />
            <button className="chatbot-send" onClick={() => addMessage(input)}>→</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
