/**
 * CarMod - Grafik Modülü
 * Chart.js v4 tabanlı araç gider, yakıt ve dyno grafikleri
 */

window.OtoCharts = {

  // ── Dahili chart referansları ──
  _expenseChart: null,
  _fuelChart: null,
  _dynoChart: null,

  // ── Ortak sabitler ──
  _darkGrid: 'rgba(255,255,255,0.05)',
  _darkTick: 'rgba(255,255,255,0.5)',
  _animDuration: 800,

  // ────────────────────────────────────────────
  // 1. Gider Dağılımı – Doughnut
  // ────────────────────────────────────────────
  updateExpenseChart(stats) {
    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Önceki grafiği yok et
    if (this._expenseChart) {
      this._expenseChart.destroy();
      this._expenseChart = null;
    }

    const values = [
      stats.maintenanceCost ?? 0,
      stats.modificationCost ?? 0,
      stats.fuelCost ?? 0,
      stats.tuningCost ?? 0,
      stats.documentCost ?? 0
    ];

    const allZero = values.every(v => v === 0);

    const labels = allZero
      ? ['Veri Yok']
      : ['Bakım', 'Modifikasyon', 'Yakıt', 'Yazılım', 'Belgeler'];

    const data = allZero ? [1] : values;

    const colors = allZero
      ? ['rgba(128,128,128,0.4)']
      : [
          'rgba(59,130,246,0.85)',   // Bakım – blue
          'rgba(139,92,246,0.85)',   // Modifikasyon – purple
          'rgba(245,158,11,0.85)',   // Yakıt – amber
          'rgba(6,182,212,0.85)',    // Yazılım – cyan
          'rgba(236,72,153,0.85)'   // Belgeler – pink
        ];

    const borderColors = allZero
      ? ['rgba(128,128,128,0.6)']
      : [
          'rgba(59,130,246,1)',
          'rgba(139,92,246,1)',
          'rgba(245,158,11,1)',
          'rgba(6,182,212,1)',
          'rgba(236,72,153,1)'
        ];

    this._expenseChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: this._animDuration },
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#ffffff',
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 12,
              font: { size: 12, family: "'Inter', sans-serif" }
            }
          },
          tooltip: {
            enabled: !allZero,
            backgroundColor: 'rgba(15,23,42,0.95)',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label(tooltipItem) {
                const value = tooltipItem.parsed;
                const formatted = value.toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
                return ` ${tooltipItem.label}: ₺${formatted}`;
              }
            }
          }
        }
      }
    });
  },

  // ────────────────────────────────────────────
  // 2. Yakıt Harcamaları – Line
  // ────────────────────────────────────────────
  updateFuelChart(fuelRecords) {
    const canvas = document.getElementById('fuelChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Önceki grafiği yok et
    if (this._fuelChart) {
      this._fuelChart.destroy();
      this._fuelChart = null;
    }

    // Tarihe göre artan sırala
    const sorted = [...fuelRecords].sort((a, b) => {
      const da = new Date(a.tarih || a.date);
      const db = new Date(b.tarih || b.date);
      return da - db;
    });

    const labels = sorted.map(r => {
      const d = new Date(r.tarih || r.date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    });

    const dataPoints = sorted.map(r => r.toplamTutar ?? 0);

    // Gradient dolgu
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight || 300);
    gradient.addColorStop(0, 'rgba(59,130,246,0.35)');
    gradient.addColorStop(1, 'rgba(59,130,246,0)');

    this._fuelChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Yakıt Maliyeti (₺)',
          data: dataPoints,
          fill: true,
          backgroundColor: gradient,
          borderColor: 'rgba(59,130,246,1)',
          borderWidth: 2.5,
          pointBackgroundColor: 'rgba(59,130,246,1)',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 7,
          tension: 0.35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: this._animDuration },
        interaction: {
          mode: 'index',
          intersect: false
        },
        scales: {
          x: {
            grid: { color: this._darkGrid },
            ticks: {
              color: this._darkTick,
              font: { size: 11, family: "'Inter', sans-serif" },
              maxRotation: 45
            },
            border: { color: 'rgba(255,255,255,0.1)' }
          },
          y: {
            beginAtZero: true,
            grid: { color: this._darkGrid },
            ticks: {
              color: this._darkTick,
              font: { size: 11, family: "'Inter', sans-serif" },
              callback(value) {
                return '₺' + value.toLocaleString('tr-TR');
              }
            },
            border: { color: 'rgba(255,255,255,0.1)' }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              usePointStyle: true,
              pointStyleWidth: 12,
              font: { size: 12, family: "'Inter', sans-serif" }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.95)',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label(tooltipItem) {
                const value = tooltipItem.parsed.y;
                const formatted = value.toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
                return ` Yakıt Maliyeti: ₺${formatted}`;
              }
            }
          }
        }
      }
    });
  },

  // ────────────────────────────────────────────
  // 3. Dyno / Performans – Bar
  // ────────────────────────────────────────────
  updateDynoChart(hpBase, hpTarget, nmBase, nmTarget) {
    const canvas = document.getElementById('dynoChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Önceki grafiği yok et
    if (this._dynoChart) {
      this._dynoChart.destroy();
      this._dynoChart = null;
    }

    // Tuned barları için gradient
    const cyanGradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight || 300);
    cyanGradient.addColorStop(0, 'rgba(6,182,212,1)');
    cyanGradient.addColorStop(1, 'rgba(6,182,212,0.4)');

    this._dynoChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Beygir Gücü (HP)', 'Tork (Nm)'],
        datasets: [
          {
            label: 'Stok',
            data: [hpBase, nmBase],
            backgroundColor: 'rgba(148,163,184,0.5)',
            borderColor: 'rgba(148,163,184,0.8)',
            borderWidth: 1.5,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          },
          {
            label: 'Tuned',
            data: [hpTarget, nmTarget],
            backgroundColor: cyanGradient,
            borderColor: 'rgba(6,182,212,1)',
            borderWidth: 1.5,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: this._animDuration },
        scales: {
          x: {
            grid: { color: this._darkGrid },
            ticks: {
              color: this._darkTick,
              font: { size: 12, family: "'Inter', sans-serif" }
            },
            border: { color: 'rgba(255,255,255,0.1)' }
          },
          y: {
            beginAtZero: true,
            grid: { color: this._darkGrid },
            ticks: {
              color: this._darkTick,
              font: { size: 11, family: "'Inter', sans-serif" },
              callback(value) {
                return value.toLocaleString('tr-TR');
              }
            },
            border: { color: 'rgba(255,255,255,0.1)' }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              usePointStyle: true,
              pointStyleWidth: 12,
              font: { size: 12, family: "'Inter', sans-serif" }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.95)',
            titleColor: '#ffffff',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label(tooltipItem) {
                const value = tooltipItem.parsed.y;
                const formatted = value.toLocaleString('tr-TR');
                const unit = tooltipItem.label.includes('HP') ? ' HP' : ' Nm';
                return ` ${tooltipItem.dataset.label}: ${formatted}${unit}`;
              }
            }
          }
        }
      }
    });
  }
};
