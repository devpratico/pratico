export const sendMessage = async (message: string) => {
    const response = await fetch('/api/bot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Error sending message');
    }

    const data = await response.json();
    console.log(data.success ? 'Message sent successfully' : 'Error while sending msg');
  };