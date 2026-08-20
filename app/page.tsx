'use client'
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth'})
  },[messages, isLoading]);

  async function handleSend() {
    const newUserMessage = {role: 'user', content: inputValue};
    const updatedMessages = [...messages, newUserMessage];
    

    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try{const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({messages: updatedMessages})
    });

    const data = await response.json();
    setMessages([...updatedMessages, { role: 'assistant', content: data.reply}]);
    } 
    
    catch(error){
      console.error('Failed to get tutor response:',error)
      setMessages([...updatedMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.'}]);
    }

    finally{
      setIsLoading(false);
    }

  }

  function handleKeyDown(e: React.KeyboardEvent){
    if (e.key === 'Enter' && !e.shiftKey){
      e.preventDefault
      handleSend();
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#343541', color: '#ececf1',fontFamily:'sans-serif'}}>
      
      <div style={{padding: '16px', borderBottom: '1px solid #4d4d4f', fontSize: '18px', fontWeight: 600}}>
        Socartic Tutor
      </div>
      
      <div style={{flex: 1, overflowY: 'auto', padding: '20px'}}>
        {messages.length === 0 && ( 
          <div style = {{opacity: 0.5, textAlign: 'center', marginTop: '40px'}}>
            Ask me anything about coding - I'll help you figure it out yourself.
          </div>

        )}

         {messages.map((msg, index) => (
        <div key={index} style = {{display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px'}}>
          <div style={{maxWidth:'70%', padding: '12px 16px', borderRadius: '16px', backgroundColor: msg.role === 'user' ? '#5436DA' : '#444654', whiteSpace: 'pre-wrap'}}>
            {msg.role === 'assistant' && (
              <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '4px'}}>
                🧑‍🎓 Tutor:
              </div>
            )}
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
          
        </div>
      ))}
     
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
          <div style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: '#444654', fontStyle: 'italic', opacity: 0.7}}>
          Tutor is thinking...
        </div>

        </div>
      )}

      <div ref={messagesEndRef} />
      </div>

        <div style={{ padding: '16px', borderTop: '1px solid #4d4d4f', display: 'flex', gap: '8px'}}>
          <input
            type="text"
            value={inputValue}
            onChange= {(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type you question..."
            disabled={isLoading}
            style={{
              flex:1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #565869',
              background: '#40414f',
              color:'#ececf1',
              fontSize: '15px',
              outline: 'none'
            }}

          />
          <button onClick={handleSend} 
                  disabled={isLoading}
                  style={{
                    padding: '12px 20px',
                    borderRadius:'8px',
                    border: 'none',
                    backgroundColor: isLoading ? '#565869' : '#5436DA',
                    color: 'white',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '15px'
                  }}>
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
    </div>
  );
}
