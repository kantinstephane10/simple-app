const countEl = document.getElementById('count');

async function callApi(path) {
    const response = await fetch(path, { method: 'POST' });
    if (!response.ok) {
        throw new Error(`Request to ${path} failed: ${response.status}`);
    }
    const data = await response.json();
    countEl.textContent = data.count;

    countEl.classList.remove('pulse');
    void countEl.offsetWidth;
    countEl.classList.add('pulse');
}

document.getElementById('inc').addEventListener('click', () => callApi('/api/counter/increment'));
document.getElementById('dec').addEventListener('click', () => callApi('/api/counter/decrement'));
document.getElementById('reset').addEventListener('click', () => callApi('/api/counter/reset'));
