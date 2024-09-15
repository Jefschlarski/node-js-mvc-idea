const handlebars = require('handlebars');

handlebars.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleDateString('pt-BR');
});

handlebars.registerHelper('hasPermission', function(userType, permitedUserTypes, options) {
    const permitedUserTypesArray = String(permitedUserTypes).split(';');
    if (!permitedUserTypesArray.includes(userType)) {
        return options.inverse(this);
    }
    return options.fn(this);
});

handlebars.registerHelper('equals', function(a, b, options) {
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

handlebars.registerHelper('renderLineChart', function (id, labels, data, title) {
    let labelsJson = JSON.stringify(labels);
    let dataJson = JSON.stringify(data);

    return new handlebars.SafeString(`
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <div class="chart">
            <h1 class="title">${title}</h1>
            <canvas id="${id}"></canvas>
        </div>
        <script>
            let ctx${id} = document.getElementById('${id}').getContext('2d');
            let myChart${id} = new Chart(ctx${id}, { 
                type: 'line',
                data: {
                    labels: ${labelsJson},
                    datasets: [{
                        label: 'Items Count',
                        data: ${dataJson},
                        backgroundColor: 'rgba(232, 0, 0, 0.2)',
                        borderColor: 'rgba(232, 0, 0, 0.2)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Count'
                            }
                        }
                    }
                }
            });
        </script>
    `);
});

handlebars.registerHelper('renderChart', function (id, labels, data, title) {
    let labelsJson = JSON.stringify(labels);
    let dataJson = JSON.stringify(data);

    return new handlebars.SafeString(`
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <div class="chart">
            <h1 class="title">${title}</h1>
            <canvas id="${id}"></canvas>
        </div>
        <script>
           let ctx${id} = document.getElementById('${id}').getContext('2d');
           let myChart${id} = new Chart(ctx${id}, {
                type: 'bar',
                data: {
                    labels: ${labelsJson},
                    datasets: [{
                        label: 'Items Count',
                        data: ${dataJson},
                        backgroundColor: 'rgba(232, 0, 0, 0.2)',
                        borderColor: 'rgba(232, 0, 0, 0.2)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Count'
                            }
                        }
                    }
                }
            });
        </script>
    `);
});

handlebars.registerPartial('flashMessage', require('../common/partials/flash-message.handlebars'));

handlebars.registerPartial('renderTable', require('../common/partials/table.handlebars'));

handlebars.registerHelper('tableHeaders', function (context, actions) {
    let headers = Object.keys(context[0] || {});
    console.log(actions);
    if (actions == 'true') {
        headers.push('actions');
    }
    let result = headers.map(header => `<th>${header}</th>`).join('');
    return result;
});

// Helper para gerar as linhas da tabela
handlebars.registerHelper('tableRows', function (context, editUrl, deleteUrl) {
    let result = context.map(item => {
        let cells = Object.values(item).map(value => {
            if (value instanceof Date) {
                value = value.toLocaleDateString('pt-BR', {
                    month: 'numeric',
                    year: 'numeric',
                    day: 'numeric',
                });
            }
            return `<td>${value}</td>`;
        }).join('');

        if (editUrl && deleteUrl) {
            cells += `<td><a href="${editUrl}/${item.id}">Edit</a> <a href="${deleteUrl}/${item.id}">Delete</a></td>`;
        }
        return `<tr>${cells}</tr>`;
    }).join('');
    return result;
});