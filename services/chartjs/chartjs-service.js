
class ChartJsService {

    constructor(utilityService) {
        this.utilityService = utilityService;
    }

    getChartJsDataset(data, label, borderColor, yAxisId) {

        return {
            label: label,
            data: data,
            borderWidth: 1,
            pointRadius: 0,
            backgroundColor: 'rgb(255, 99, 132)',
            fill: 'start',
            borderColor: borderColor,
            yAxisID: yAxisId,
            lineTension: 0,
            pointStyle: 'rectRot'
        };
    }

    getChartJsOptions(arr1, arr2, currency1, currency2, dataFrequency) {

        let options = {
            customLine: {
                color: 'white'
            },
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            legend: {
                labels: {
                    usePointStyle: true
                }
            },
            tooltips: {
                enabled: true,
                position: 'nearest',
                mode: 'index',
                intersect: false,
                cornerRadius: 2,
                callbacks: {
                    title: (tooltipItems, data) => {
                        if (tooltipItems[0].xLabel.format)
                            return tooltipItems[0].xLabel.format('lll');
                        return tooltipItems[0].xLabel;
                    },
                    label: (tooltipItem, data) => {
                        let label = data.datasets[tooltipItem.datasetIndex].label || '';
                        label += ': ';
                        label += this.utilityService.formatCurrency(tooltipItem.yLabel);
                        return label;
                    }
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: (arr1 && arr1.length > 0 && arr1.length < 90) || (arr2 && arr2.length > 0 && arr2.length < 90) || dataFrequency == 'hours' ? 'day' : 'month'
                    }
                }],
                yAxes: [],
            }
        };

        if (arr1 && arr1.length > 0) {
            options.scales.yAxes.push({
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-axis-1',
                ticks: {
                    callback: (value, index, values) => {
                        return this.utilityService.formatCurrency(value);
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: currency1
                }
            });
        };

        if (arr2 && arr2.length > 0) {
            options.scales.yAxes.push({
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-2',
                ticks: {
                    callback: (value, index, values) => {
                        return this.utilityService.formatCurrency(value);
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: currency2
                }
            });
        };

        return options;
    }

    getPlugins() {

        let verticalLinePlugin = {
            afterDatasetsDraw: (chart) => {

                if (chart.tooltip._active && chart.tooltip._active.length) {

                    let activePoint = chart.tooltip._active[0];
                    let ctx = chart.ctx;
                    let y_axis = chart.scales['y-axis-1'] || chart.scales['y-axis-2'];

                    if (!y_axis)
                        return;

                    let x = activePoint.tooltipPosition().x;
                    let topY = y_axis.top;
                    let bottomY = y_axis.bottom;

                    // draw line
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, topY);
                    ctx.lineTo(x, bottomY);
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#585858';
                    ctx.stroke();
                    ctx.restore();
                }
            }
        };

        return [verticalLinePlugin]
    }
}

module.exports = ChartJsService;