const countEl = document.getElementById('count');
const bestEl = document.getElementById('best');
const clicksEl = document.getElementById('clicks');
const card = document.getElementById('card');
const toast = document.getElementById('toast');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function applyMood(count) {
    const magnitude = Math.min(Math.abs(count), 50);
    const hue = count >= 0 ? 150 - magnitude : 10 + magnitude;
    const alpha = (0.15 + (magnitude / 50) * 0.35).toFixed(2);
    card.style.boxShadow = `0 12px 30px var(--card-shadow), 0 0 0 3px hsl(${hue} 70% 55% / ${alpha})`;
}

function flip() {
    if (prefersReducedMotion) return;
    countEl.classList.remove('pulse');
    void countEl.offsetWidth;
    countEl.classList.add('pulse');
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

function render(snapshot) {
    countEl.textContent = snapshot.count;
    bestEl.textContent = snapshot.best;
    clicksEl.textContent = snapshot.totalClicks;
    flip();
    applyMood(snapshot.count);
    if (snapshot.milestone) {
        showToast(`Milestone reached: ${snapshot.count}`);
        burstConfetti();
    }
}

async function callApi(path) {
    const response = await fetch(path, { method: 'POST' });
    if (!response.ok) {
        throw new Error(`Request to ${path} failed: ${response.status}`);
    }
    render(await response.json());
}

document.getElementById('inc').addEventListener('click', () => callApi('/api/counter/increment'));
document.getElementById('dec').addEventListener('click', () => callApi('/api/counter/decrement'));
document.getElementById('reset').addEventListener('click', () => callApi('/api/counter/reset'));

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        event.preventDefault();
        callApi('/api/counter/increment');
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
        event.preventDefault();
        callApi('/api/counter/decrement');
    } else if (event.key === 'r' || event.key === 'R') {
        callApi('/api/counter/reset');
    }
});

applyMood(Number(countEl.textContent));
