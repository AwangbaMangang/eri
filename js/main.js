async function fetchAndTranslate() {
  const title = document.getElementById('search').value;
  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '<p>Fetching article...</p>';

  const response = await fetch(https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&origin=*);
  const data = await response.json();

  const html = data?.parse?.text['*'];
  if (!html) {
    outputDiv.innerHTML = <p>Article not found</p>;
    return;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const paragraphs = Array.from(tempDiv.querySelectorAll('p')).slice(0, 20); // Limit to 20

  outputDiv.innerHTML = '';

  for (let para of paragraphs) {
    const originalText = para.innerText.trim();
    if (!originalText) continue;

    const paraContainer = document.createElement('div');
    paraContainer.innerHTML = <div class="spinner"></div> Translating...;
    outputDiv.appendChild(paraContainer);

    const translated = await translateText(originalText);
    paraContainer.innerHTML = <p class="translated">${translated}</p>;
  }
}

async function translateText(text) {
  const payload = {
    "source_language": "en",
    "target_language": "mni",
    "text": text
  };

  try {
    const response = await fetch("https://indictrans-backend.ai4bharat.org/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data?.output?.[0]?.target || "[Translation Error]";
  } catch (err) {
    console.error(err);
    return "[Error during translation]";
  }
}
