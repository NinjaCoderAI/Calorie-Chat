// whatsappService.js
async function sendMessage(url, body) {
  try {
    const fetch = await import('node-fetch').then(mod => mod.default);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

module.exports = { sendMessage };
