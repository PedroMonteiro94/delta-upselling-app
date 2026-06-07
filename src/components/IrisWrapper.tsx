import React, { useEffect } from 'react';

export const IrisWrapper: React.FC = () => {
  useEffect(() => {
    if (document.getElementById('elevenlabs-widget-script')) return;

    const script = document.createElement('script');
    script.id = 'elevenlabs-widget-script';
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.type = 'text/javascript';
    
    script.onload = () => {
      console.log("Íris: Script da ElevenLabs carregado com sucesso!");
    };

    document.head.appendChild(script);
  }, []);

 return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 99999,
        width: 'auto',
        height: 'auto'
      }}
      dangerouslySetInnerHTML={{
        __html: `
          <elevenlabs-widget 
            agent-id="agent_0801ksmyr9pvh0o9g9" 
            avatar-line-color="#E21836"
            avatar-background-color="#000000"
          ></elevenlabs-widget>
        `
      }}
    />
  );
};