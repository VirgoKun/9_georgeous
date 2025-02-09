async function fetchMessages() {
  const response = await fetch(`https://api.github.com/repos/${process.env.9_georgeous}/contents/${process.env.messages.json}`, {
    headers: {
      Authorization: `token ${process.env.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}`
    }
  });
  const data = await response.json();
  const content = atob(data.content);
  return JSON.parse(content);
}

async function updateMessages(newMessages) {
  const response = await fetch(`https://api.github.com/repos/${process.env.9_georgeous}/contents/${process.env.messgaes.json}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${process.env.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}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Update messages.json',
      content: btoa(JSON.stringify(newMessages)),
      sha: (await fetchMessages()).sha
    })
  });
  return await response.json();
}

async function sendAnonText() {
  const message = document.getElementById('anon-input').value;
  if (message.trim() !== '') {
    const messages = await fetchMessages();
    messages.push({ message, timestamp: new Date().getTime() });
    await updateMessages(messages);
    document.getElementById('anon-input').value = '';
    displayMessages();
  }
}

async function displayMessages() {
  const messages = await fetchMessages();
  const currentTime = new Date().getTime();
  const validMessages = messages.filter(msg => (currentTime - msg.timestamp) <= 168 * 60 * 60 * 1000);
  const messagesDiv = document.getElementById('anon-messages');
  messagesDiv.innerHTML = '';
  validMessages.forEach(msg => {
    const newMessage = document.createElement('div');
    newMessage.className = 'bg-gray-700 p-2 rounded mt-2';
    newMessage.textContent = msg.message;
    messagesDiv.appendChild(newMessage);
  });
        }
