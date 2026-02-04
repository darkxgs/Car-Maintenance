// ===== Chart.js Utilities and Components =====

/**
 * Configure Chart.js defaults for Arabic RTL support
 */
function configureChartDefaults() {
    if (typeof window !== 'undefined' && window.Chart) {
        Chart.defaults.font.family = "'Segoe UI', 'Cairo', Tahoma, Geneva, Verdana, sans-serif";
        Chart.defaults.color = '#64748b';
        Chart.defaults.plugins.legend.rtl = true;
        Chart.defaults.plugins.legend.textDirection = 'rtl';
    }
}


/**
 * Common chart options for consistent styling
 */
const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            rtl: true,
            labels: {
                padding: 15,
                usePointStyle: true,
                font: {
                    size: 12,
                    family: "'Segoe UI', 'Cairo', sans-serif"
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#0ea5e9',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 13
            },
            rtl: true,
            textDirection: 'rtl'
        }
    }
};

/**
 * Create a line chart for operations over time
 * @param {string} canvasId - ID of the canvas element
 * @param {Array} data - Array of {date, count} objects
 * @returns {Chart} Chart.js instance
 */
function createOperationsLineChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = data.map(d => d.date);
    const values = data.map(d => d.count);

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'عدد العمليات',
                data: values,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            ...commonChartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Create a pie chart for operations by branch
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} data - Object with branch names as keys and counts as values
 * @returns {Chart} Chart.js instance
 */
function createBranchPieChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = Object.keys(data);
    const values = Object.values(data);

    const colors = [
        '#2563eb', // blue
        '#10b981', // green
        '#f59e0b', // orange
        '#8b5cf6', // purple
        '#ef4444', // red
        '#0ea5e9', // cyan
        '#ec4899'  // pink
    ];

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#fff',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    ...commonChartOptions.plugins.legend,
                    position: 'right'
                }
            }
        }
    });
}

/**
 * Create a bar chart for oil types usage
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} data - Object with oil type names as keys and counts as values
 * @returns {Chart} Chart.js instance
 */
function createOilTypesBarChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = Object.keys(data);
    const values = Object.values(data);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'عدد الاستخدامات',
                data: values,
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderColor: '#2563eb',
                borderWidth: 2,
                borderRadius: 8,
                barPercentage: 0.7
            }]
        },
        options: {
            ...commonChartOptions,
            indexAxis: 'y', // Horizontal bar chart
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Create a doughnut chart for viscosity distribution
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} data - Object with viscosity types as keys and counts as values
 * @returns {Chart} Chart.js instance
 */
function createViscosityDoughnutChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const labels = Object.keys(data);
    const values = Object.values(data);

    const colors = [
        '#10b981', // green
        '#2563eb', // blue
        '#f59e0b', // orange
        '#8b5cf6', // purple
        '#ef4444'  // red
    ];

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#fff',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            ...commonChartOptions,
            cutout: '65%',
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    ...commonChartOptions.plugins.legend,
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Update KPI cards with statistics
 * @param {Object} stats - Statistics object from API
 */
function updateKPICards(stats) {
    // Total operations
    const totalOpsEl = document.getElementById('kpi-total-ops');
    if (totalOpsEl) {
        totalOpsEl.textContent = stats.totalOperations || 0;
    }

    // Mismatch rate
    const mismatchRateEl = document.getElementById('kpi-mismatch-rate');
    if (mismatchRateEl && stats.totalOperations > 0) {
        const rate = ((stats.mismatchedOperations / stats.totalOperations) * 100).toFixed(1);
        mismatchRateEl.textContent = `${rate}%`;
    }

    // Total oil used
    const totalOilEl = document.getElementById('kpi-total-oil');
    if (totalOilEl) {
        totalOilEl.textContent = `${stats.totalOilUsed || 0} لتر`;
    }

    // Average operations per day
    const avgOpsEl = document.getElementById('kpi-avg-ops');
    if (avgOpsEl && stats.daysActive > 0) {
        const avg = (stats.totalOperations / stats.daysActive).toFixed(1);
        avgOpsEl.textContent = avg;
    }
}

/**
 * Destroy chart instance if it exists
 * @param {Chart} chart - Chart.js instance
 */
function destroyChart(chart) {
    if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
    }
}

/**
 * Format date for display in Arabic
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDateArabic(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
}

/**
 * Get last N days of data for charts
 * @param {Array} operations - All operations
 * @param {number} days - Number of days to include
 * @returns {Array} Array of {date, count} objects
 */
function getOperationsByDay(operations, days = 30) {
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDateArabic(date);

        const count = operations.filter(op => {
            const opDate = new Date(op.created_at);
            opDate.setHours(0, 0, 0, 0);
            return opDate.getTime() === date.getTime();
        }).length;

        result.push({ date: dateStr, count });
    }

    return result;
}

// Initialize Chart.js defaults on load
if (typeof window !== 'undefined') {
    configureChartDefaults();
}
