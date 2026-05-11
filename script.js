const SURVEY_DATA_FALLBACK = {
    "total_responses": 153,
    "questions": [
        { "question": "Hiç sanmam", "data": [23, 44, 49, 14, 4, 7, 2, 4, 0, 3, 3] },
        { "question": "Pek sanmıyorum", "data": [4, 7, 32, 54, 31, 10, 3, 6, 3, 0, 3] },
        { "question": "Zor", "data": [8, 21, 19, 42, 26, 18, 7, 2, 4, 1, 5] },
        { "question": "Muhtemelen", "data": [0, 4, 2, 1, 12, 30, 30, 44, 18, 8, 4] },
        { "question": "Herhalde olur", "data": [0, 1, 3, 4, 6, 18, 52, 30, 25, 9, 5] },
        { "question": "Düşük ihtimal", "data": [2, 11, 30, 47, 33, 13, 9, 2, 1, 2, 3] },
        { "question": "Belki", "data": [1, 3, 7, 19, 22, 64, 25, 4, 2, 2, 4] },
        { "question": "Yarı yarıya", "data": [1, 0, 0, 4, 6, 120, 12, 6, 1, 1, 2] },
        { "question": "Olabilir", "data": [1, 0, 0, 4, 5, 22, 43, 46, 20, 7, 5] },
        { "question": "Mümkün", "data": [2, 0, 0, 0, 4, 16, 17, 35, 44, 17, 18] },
        { "question": "Yüksek ihtimal", "data": [1, 0, 0, 1, 0, 2, 1, 9, 56, 67, 16] },
        { "question": "Büyük ihtimal", "data": [1, 1, 0, 2, 0, 1, 1, 17, 31, 79, 20] },
        { "question": "Ölme eşeğim ölme", "data": [39, 44, 23, 15, 9, 12, 2, 4, 1, 0, 4] },
        { "question": "Neredeyse", "data": [1, 2, 4, 11, 16, 29, 29, 21, 22, 15, 3] },
        { "question": "Kısmet", "data": [10, 12, 14, 20, 25, 52, 6, 5, 3, 1, 5] },
        { "question": "Bakarsın olur", "data": [4, 2, 7, 10, 11, 48, 25, 23, 12, 5, 6] },
        { "question": "Muallak", "data": [5, 5, 14, 21, 38, 60, 7, 0, 0, 1, 2] },
        { "question": "Kuvvetle muhtemel", "data": [3, 0, 2, 0, 1, 5, 10, 30, 48, 44, 10] },
        { "question": "Banko", "data": [5, 1, 0, 0, 1, 4, 5, 10, 15, 51, 61] },
        { "question": "Adım gibi eminim", "data": [4, 1, 0, 0, 0, 1, 2, 4, 12, 23, 106] }
    ]
};

function sinc(x) {
    if (x === 0) return 1;
    const pix = Math.PI * x;
    return Math.sin(pix) / pix;
}

function interpolate(dataPoints, x) {
    // Current Sinc Interpolation
    let sum = 0;
    let rightNeighbour = Math.floor(x + 10);
    let leftNeighbour = Math.ceil(x - 10);

    for (let i = Math.max(leftNeighbour, 0); i <= Math.min(rightNeighbour, 10); i++) {
        sum += dataPoints[i] * sinc(x - i);
    }
    return sum;
}

// Alternative: Cubic Spline Interpolation
// This pre-calculates coefficients for a natural cubic spline
function getSplineInterpolate(y) {
    const n = y.length - 1;
    const a = [...y];
    const b = new Array(n);
    const d = new Array(n);
    const h = new Array(n).fill(1); // x_i+1 - x_i is always 1 in our case

    const alpha = new Array(n);
    for (let i = 1; i < n; i++) {
        alpha[i] = (3 / h[i]) * (a[i + 1] - a[i]) - (3 / h[i - 1]) * (a[i] - a[i - 1]);
    }

    const l = new Array(n + 1);
    const mu = new Array(n + 1);
    const z = new Array(n + 1);
    const c = new Array(n + 1);

    l[0] = 1; mu[0] = 0; z[0] = 0;
    for (let i = 1; i < n; i++) {
        l[i] = 2 * (h[i - 1] + h[i]) - h[i - 1] * mu[i - 1];
        mu[i] = h[i] / l[i];
        z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
    }

    l[n] = 1; z[n] = 0; c[n] = 0;
    for (let j = n - 1; j >= 0; j--) {
        c[j] = z[j] - mu[j] * c[j + 1];
        b[j] = (a[j + 1] - a[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3;
        d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
    }

    return function (x) {
        let i = Math.floor(x);
        if (i >= n) i = n - 1;
        if (i < 0) i = 0;
        const dx = x - i;
        return a[i] + b[i] * dx + c[i] * Math.pow(dx, 2) + d[i] * Math.pow(dx, 3);
    };
}

// Alternative: Monotone Cubic Interpolation (Fritsch-Carlson)
// Prevents overshooting and negative values by ensuring monotonicity.
function getMonotoneInterpolate(y) {
    const n = y.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const deltas = new Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
        deltas[i] = (y[i + 1] - y[i]); // h_i is 1
    }

    const m = new Array(n);
    m[0] = deltas[0];
    m[n - 1] = deltas[n - 2];
    for (let i = 1; i < n - 1; i++) {
        m[i] = (deltas[i - 1] + deltas[i]) / 2;
    }

    for (let i = 0; i < n - 1; i++) {
        if (deltas[i] === 0) {
            m[i] = 0;
            m[i + 1] = 0;
        } else {
            const alpha = m[i] / deltas[i];
            const beta = m[i + 1] / deltas[i];
            const h = alpha * alpha + beta * beta;
            if (h > 9) {
                const tau = 3 / Math.sqrt(h);
                m[i] = tau * alpha * deltas[i];
                m[i + 1] = tau * beta * deltas[i];
            }
        }
    }

    return function (val) {
        let i = Math.floor(val);
        if (i >= n - 1) i = n - 2;
        if (i < 0) i = 0;
        const h = 1;
        const t = (val - i) / h;
        const t2 = t * t;
        const t3 = t2 * t;
        const h00 = 2 * t3 - 3 * t2 + 1;
        const h10 = t3 - 2 * t2 + t;
        const h01 = -2 * t3 + 3 * t2;
        const h11 = t3 - t2;
        return h00 * y[i] + h10 * h * m[i] + h01 * y[i + 1] + h11 * h * m[i + 1];
    };
}

async function loadAndRender() {
    let surveyData = SURVEY_DATA_FALLBACK;

    // Try to load dynamic data if available
    try {
        const response = await fetch('survey_data.json?v=' + Date.now());
        if (response.ok) surveyData = await response.json();
    } catch (e) { console.log("Falling back to embedded data"); }

    const processed = surveyData.questions.map(q => {
        const points = [];
        let maxVal = -Infinity;
        let maxPos = 0;

        // Choose method: 'sinc', 'spline', or 'monotone'
        const method = 'monotone';
        const interpFunc =
            method === 'monotone' ? getMonotoneInterpolate(q.data) :
                method === 'spline' ? getSplineInterpolate(q.data) : null;

        for (let x = 0; x <= 10; x += 0.05) {
            const val = interpFunc ? interpFunc(x) : interpolate(q.data, x);
            points.push({ x: x * 10, y: (val / surveyData.total_responses) * 100 });
            if (val > maxVal) { maxVal = val; maxPos = x; }
        }
        return {
            title: q.question,
            points: points,
            peakY: (maxVal / surveyData.total_responses) * 100,
            peakX: maxPos * 10
        };
    });

    // Normalize all data with peakY
    processed.forEach(q => {
        q.points.forEach(p => {
            p.y = (p.y / q.peakY) * 100;
        });
        q.peakY = 100;
    });


    // Sort by peakX (Probability Value) as requested
    processed.sort((a, b) => a.peakX - b.peakX);

    const grid = document.getElementById('chartsGrid');
    grid.innerHTML = '';

    processed.forEach((data, index) => {
        const card = document.createElement('div');
        card.className = 'chart-card';
        card.innerHTML = `
            <div class="chart-label">${data.title}</div>
            <div class="canvas-container">
                <canvas id="chart-${index}"></canvas>
            </div>
        `;
        grid.appendChild(card);

        const ctx = document.getElementById(`chart-${index}`).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        data: data.points,
                        borderColor: '#0f172a',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        data: [{ x: data.peakX, y: data.peakY }],
                        backgroundColor: '#dc2626',
                        pointRadius: 4,
                        showLine: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { top: 20 } },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { type: 'linear', min: 0, max: 110, display: false },
                    y: { min: -10, max: 110, display: false }
                },
                animation: false
            },
            plugins: [{
                id: 'peakLabel',
                afterDraw: (chart) => {
                    const { ctx } = chart;
                    const meta = chart.getDatasetMeta(1);
                    const point = meta.data[0];
                    if (point) {
                        ctx.save();
                        ctx.fillStyle = '#dc2626';
                        ctx.font = 'bold 10px Inter';
                        ctx.textAlign = 'center';
                        ctx.fillText(`%${data.peakX.toFixed(0)}`, point.x, point.y - 10);
                        ctx.restore();
                    }
                }
            }]
        });
    });
}

document.addEventListener('DOMContentLoaded', loadAndRender);
