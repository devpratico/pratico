import React from 'react';

interface EmailTemplateProps {
  name: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ name }) => (
  <div>
    <h1>Bonjour {name} !</h1>
    <p>Ceci est un email généré dynamiquement.</p>
  </div>
);
