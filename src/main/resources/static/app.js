const countersEl = document.getElementById('counters');
const activityListEl = document.getElementById('activity-list');
const addForm = document.getElementById('add-counter-form');
const newCounterNameInput = document.getElementById('new-counter-name');
const toast = document.getElementById('toast');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let activeCounterId = null;
let justUpdatedId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function moodShadow(count) {
    const magnitude = Math.min(Math.abs(count), 50);
    const hue = count >= 0 ? 150 - magnitude : 10 + magnitude;
    const alpha = (0.15 + (magnitude / 50) * 0.35).toFixed(2);
    return `0 12px 30px var(--card-shadow), 0 0 0 3px hsl(${hue} 70% 55% / ${alpha})`;
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

function counterCardHtml(counter) {
    const justUpdatedClass = counter.id === justUpdatedId ? ' just-updated' : '';
    return `
        <div class="counter-card${justUpdatedClass}" data-id="${counter.id}" style="box-shadow: ${moodShadow(counter.count)}">
            <div class="counter-head">
                <span class="counter-name">${escapeHtml(counter.name)}</span>
                <button type="button" class="remove-btn" aria-label="Remove ${escapeHtml(counter.name)}">&times;</button>
            </div>
            <p class="count">${counter.count}</p>
            <div class="actions">
                <button type="button" class="dec" aria-label="Decrement">-</button>
                <button type="button" class="reset">Reset</button>
                <button type="button" class="inc" aria-label="Increment">+</button>
            </div>
            <p class="stats">Best ${counter.best} &middot; Clicks ${counter.totalClicks}</p>
        </div>
    `;
}

function renderCounters(counters) {
    countersEl.innerHTML = counters.map(counterCardHtml).join('');
    if (!counters.some((c) => c.id === activeCounterId)) {
        activeCounterId = counters.length ? counters[0].id : null;
    }
}

function timeAgo(timestamp) {
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
}

function renderActivity(entries) {
    if (!entries.length) {
        activityListEl.innerHTML = '<li class="activity-empty">No activity yet</li>';
        return;
    }
    activityListEl.innerHTML = entries.map((entry) => `
        <li>
            <span class="activity-name">${escapeHtml(entry.counterName)}</span>
            <span class="activity-action">${escapeHtml(entry.action)}</span>
            <span class="activity-result">&rarr; ${entry.resultingCount}</span>
            <span class="activity-time">${timeAgo(entry.timestamp)}</span>
        </li>
    `).join('');
}

let toastTimeout;
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('visible'), 1800);
}

function burstConfetti() {
    if (prefersReducedMotion) return;

    const colors = ['#f2545b', '#f7b731', '#20bf6b', '#4b7bec', '#a55eea'];
    const particles = Array.from({ length: 60 }, () => ({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 4,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
    }));

    const gravity = 0.35;
    const start = performance.now();
    const duration = 1400;

    function frame(now) {
        const elapsed = now - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            p.vy += gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.spin;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        });
        if (elapsed < duration) {
            requestAnimationFrame(frame);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    requestAnimationFrame(frame);
}

async function api(path, options) {
    const response = await fetch(path, options);
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request to ${path} failed: ${response.status}`);
    }
    return response.status === 204 ? null : response.json();
}

async function loadAll() {
    const [counters, activity] = await Promise.all([
        api('/api/counters'),
        api('/api/counters/activity'),
    ]);
    renderCounters(counters);
    renderActivity(activity);
}

async function act(id, action) {
    const counter = await api(`/api/counters/${id}/${action}`, { method: 'POST' });
    activeCounterId = id;
    justUpdatedId = id;
    await loadAll();
    if (counter.milestone) {
        showToast(`${counter.name}: milestone reached (${counter.count})`);
        burstConfetti();
    }
}

countersEl.addEventListener('click', (event) => {
    const card = event.target.closest('.counter-card');
    if (!card) return;
    const id = card.dataset.id;
    activeCounterId = id;

    if (event.target.closest('.inc')) {
        act(id, 'increment');
    } else if (event.target.closest('.dec')) {
        act(id, 'decrement');
    } else if (event.target.closest('.reset')) {
        act(id, 'reset');
    } else if (event.target.closest('.remove-btn')) {
        api(`/api/counters/${id}`, { method: 'DELETE' })
            .then(loadAll)
            .catch((err) => showToast(err.message));
    }
});

addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = newCounterNameInput.value.trim();
    newCounterNameInput.value = '';
    api('/api/counters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    }).then(loadAll);
});

document.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT') return;
    if (!activeCounterId) return;

    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        event.preventDefault();
        act(activeCounterId, 'increment');
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
        event.preventDefault();
        act(activeCounterId, 'decrement');
    } else if (event.key === 'r' || event.key === 'R') {
        act(activeCounterId, 'reset');
    }
});

loadAll();
