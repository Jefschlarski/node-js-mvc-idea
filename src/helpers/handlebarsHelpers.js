import handlebars from "handlebars";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregando os templates como strings
const adminModuleTileStr = readFileSync(
  join(__dirname, "../partials/admin-module-tile.handlebars"),
  "utf-8",
);
const ideaTileStr = readFileSync(
  join(__dirname, "../partials/idea-tile.handlebars"),
  "utf-8",
);
const actionsStr = readFileSync(
  join(__dirname, "../partials/actions.handlebars"),
  "utf-8",
);
const flashMessageStr = readFileSync(
  join(__dirname, "../partials/flash-message.handlebars"),
  "utf-8",
);
const renderTableStr = readFileSync(
  join(__dirname, "../partials/table.handlebars"),
  "utf-8",
);
const renderPaginationStr = readFileSync(
  join(__dirname, "../partials/pagination.handlebars"),
  "utf-8",
);

// Primeiro registrar os partials
handlebars.registerPartial("adminModuleTile", adminModuleTileStr);
handlebars.registerPartial("ideaTile", ideaTileStr);
handlebars.registerPartial("actions", actionsStr);
handlebars.registerPartial("flashMessage", flashMessageStr);
handlebars.registerPartial("renderTable", renderTableStr);
handlebars.registerPartial("renderPagination", renderPaginationStr);

// Compilar o template actions para uso no helper tableRows
const actionsTemplate = handlebars.compile(actionsStr);

handlebars.registerHelper("formatDate", function (date) {
  return new Date(date).toLocaleDateString("pt-BR");
});

handlebars.registerHelper(
  "hasPermission",
  function (userType, permitedUserTypes, options) {
    const permitedUserTypesArray = String(permitedUserTypes).split(";");
    if (!permitedUserTypesArray.includes(userType)) {
      return options.inverse(this);
    }
    return options.fn(this);
  },
);

handlebars.registerHelper("equals", function (a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

handlebars.registerHelper(
  "renderLineChart",
  function (id, labels, data, title) {
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
  },
);

handlebars.registerHelper("renderChart", function (id, labels, data, title) {
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

handlebars.registerHelper("tableHeaders", function (context, actions) {
  let headers = Object.keys(context?.[0] || {});
  if (actions == "true") {
    headers.push("actions");
  }
  let result = headers.map((header) => `<th>${header}</th>`).join("");
  return result;
});

handlebars.registerHelper("tableRows", function (context, editUrl, deleteUrl) {
  let result = context
    .map((item) => {
      let id = item.id;
      let cells = Object.values(item)
        .map((value) => {
          if (value instanceof Date) {
            value = value.toLocaleDateString("pt-BR", {
              month: "numeric",
              year: "numeric",
              day: "numeric",
            });
          }
          return `<td>${value}</td>`;
        })
        .join("");

      if (editUrl && deleteUrl) {
        cells += `<td>${actionsTemplate({ editUrl, deleteUrl, id })}</td>`;
      }
      return `<tr>${cells}</tr>`;
    })
    .join("");
  return new handlebars.SafeString(result);
});

handlebars.registerHelper("gt", function (a, b) {
  return a > b;
});

handlebars.registerHelper("lt", function (a, b) {
  return a < b;
});

handlebars.registerHelper("add", function (a, b) {
  return a + b;
});

handlebars.registerHelper("subtract", function (a, b) {
  return a - b;
});

handlebars.registerHelper("range", function (start, end) {
  const rangeArray = [];
  for (let i = start; i <= end; i++) {
    rangeArray.push(i);
  }
  return rangeArray;
});

handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

export default handlebars;
