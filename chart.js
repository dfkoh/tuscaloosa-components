
// Need to customize the Rectangle.prototype.draw method for rounded corners
//
// Adapted from 
// https://stackoverflow.com/questions/43254153/how-to-create-rounded-bars-for-bar-chart-js-v2
//
// Customize the Rectangle.prototype draw method
Chart.elements.Rectangle.prototype.draw = function () {
  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;

  // If radius is less than 0 or is large enough to cause drawing errors a max
  //      radius is imposed. If cornerRadius is not defined set it to 0.
  var cornerRadius = this._chart.config.options.cornerRadius;
  var fullCornerRadius = this._chart.config.options.fullCornerRadius;
  var stackedRounded = this._chart.config.options.stackedRounded;
  var typeOfChart = this._chart.config.type;

  if (cornerRadius < 0) {
    cornerRadius = 0;
  }
  if (typeof cornerRadius == 'undefined') {
    cornerRadius = 0;
  }
  if (typeof fullCornerRadius == 'undefined') {
    fullCornerRadius = false;
  }
  if (typeof stackedRounded == 'undefined') {
    stackedRounded = false;
  }

  if (!vm.horizontal) {
    // bar
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || 'bottom';
  } else {
    // horizontal bar
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || 'left';
  }

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    var borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
    var borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
    var borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  var corners = [
    [left, bottom],
    [left, top],
    [right, top],
    [right, bottom]
  ];

  // Find first (starting) corner with fallback to 'bottom'
  var borders = ['bottom', 'left', 'top', 'right'];
  var startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  var corner = cornerAt(0);
  ctx.moveTo(corner[0], corner[1]);


  var nextCornerId, nextCorner, width, height, x, y;
  for (var i = 1; i < 4; i++) {
    corner = cornerAt(i);
    nextCornerId = i + 1;
    if (nextCornerId == 4) {
      nextCornerId = 0
    }

    nextCorner = cornerAt(nextCornerId);

    width = corners[2][0] - corners[1][0];
    height = corners[0][1] - corners[1][1];
    x = corners[1][0];
    y = corners[1][1];

    var radius = cornerRadius;
    // Fix radius being too large
    if (radius > Math.abs(height) / 2) {
      radius = Math.floor(Math.abs(height) / 2);
    }
    if (radius > Math.abs(width) / 2) {
      radius = Math.floor(Math.abs(width) / 2);
    }

      var x_tl, x_tr, y_tl, y_tr, x_bl, x_br, y_bl, y_br;
      if (height < 0) {
        // Negative values in a standard bar chart
        x_tl = x;
        x_tr = x + width;
        y_tl = y + height;
        y_tr = y + height;

        x_bl = x;
        x_br = x + width;
        y_bl = y;
        y_br = y;

        // Draw
        ctx.moveTo(x_bl + radius, y_bl);

        ctx.lineTo(x_br - radius, y_br);

        // bottom right
        ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius);


        ctx.lineTo(x_tr, y_tr + radius);

        // top right
        fullCornerRadius ? ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr) : ctx.lineTo(x_tr, y_tr, x_tr - radius, y_tr);


        ctx.lineTo(x_tl + radius, y_tl);

        // top left
        fullCornerRadius ? ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius) : ctx.lineTo(x_tl, y_tl, x_tl, y_tl + radius);


        ctx.lineTo(x_bl, y_bl - radius);

        //  bottom left
        ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);

      } else if (width < 0) {
        // Negative values in a horizontal bar chart
        x_tl = x + width;
        x_tr = x;
        y_tl = y;
        y_tr = y;

        x_bl = x + width;
        x_br = x;
        y_bl = y + height;
        y_br = y + height;

        // Draw
        ctx.moveTo(x_bl + radius, y_bl);

        ctx.lineTo(x_br - radius, y_br);

        //  Bottom right corner
        fullCornerRadius ? ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius) : ctx.lineTo(x_br, y_br, x_br, y_br - radius);

        ctx.lineTo(x_tr, y_tr + radius);

        // top right Corner
        fullCornerRadius ? ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr) : ctx.lineTo(x_tr, y_tr, x_tr - radius, y_tr);

        ctx.lineTo(x_tl + radius, y_tl);

        // top left corner
        ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius);

        ctx.lineTo(x_bl, y_bl - radius);

        //  bttom left corner
        ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);

      } else {
      
          var lastVisible = 0;
        for (var findLast = 0, findLastTo = this._chart.data.datasets.length; findLast < findLastTo; findLast++) {
          if (!this._chart.getDatasetMeta(findLast).hidden) {
            lastVisible = findLast;
          }
        }
        var rounded = this._datasetIndex === lastVisible || stackedRounded;

        if (rounded) {
        //Positive Value
          ctx.moveTo(x + radius, y);

          ctx.lineTo(x + width - radius, y);

          // top right
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);


          ctx.lineTo(x + width, y + height - radius);

          // bottom right
          if (fullCornerRadius || typeOfChart == 'horizontalBar')
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          else
            ctx.lineTo(x + width, y + height, x + width - radius, y + height);


          ctx.lineTo(x + radius, y + height);

          // bottom left
          if (fullCornerRadius)
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          else
            ctx.lineTo(x, y + height, x, y + height - radius);


          ctx.lineTo(x, y + radius);

          // top left
          if (fullCornerRadius || typeOfChart == 'bar')
            ctx.quadraticCurveTo(x, y, x + radius, y);
          else
            ctx.lineTo(x, y, x + radius, y);
        }else {
          ctx.moveTo(x, y);
          ctx.lineTo(x + width, y);
          ctx.lineTo(x + width, y + height);
          ctx.lineTo(x, y + height);
          ctx.lineTo(x, y);
        }
      }
    
  }

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};


const moneyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

spendingChartData = {
  labels: ['Spent', 'Approved', 'Budgeted'],
  data: [75000, 115343, 1500000],
  colors: ['#1b75bc', '#8bbfe8', '#eaf4f6'],
  textColors: ['#1b75bc', '#8bbfe8', 'black'],
};

fundingChartData = {
  labels: ['Elevate Fund', 'Outside Funding', 'Other City Funds'],
  data: [181234, 411232.12, 123456],
  colors: ['#2f2e2e', '#858585', '#bcbdc0'],
  textColors: ['white', 'black', 'black'],
};

const makePieChart = (ctx, chartData) => {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartData.labels,
      datasets: [{
        data: chartData.data,
        backgroundColor: chartData.colors,
      }]
    },
    options: {
      cutoutPercentage: 30,
      tooltips: {
        enabled: true,
        callbacks: {
          label: function(tooltipItem, data) {
            let label = data.labels[tooltipItem.index];
            let dataset = data.datasets[tooltipItem.datasetIndex];

            if (label) {
              label += ': ';
            }
            label += moneyFormat.format(dataset.data[tooltipItem.index]);
            return label;
          }
        }

      },
      /*
      hover: {
        animationDuration: 1
      }, 
      animation: {
        duration: 1,
      },
      */
      legend: false,
      maintainAspectRatio: false,
    }
  });

}

const makeChart = (ctx, chartData, isStacked) => {
  let datasets = []
  for (let i = 0; i < chartData.data.length; i++) {
    datasets.push({
      label: chartData.labels[i],
      data: [chartData.data[i]],
      categoryPercentage: 0.5,
      barPercentage: 0.95,
      backgroundColor: [chartData.colors[i]],
      textColor: chartData.textColors[i],
      stack : isStacked ? 'stack' : undefined
    });
  }


  return new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: [' '],
      datasets,
    },
    options: {
      cornerRadius: 3, 
      stackedRounded: !isStacked,
      tooltips: {
        enabled: true
      },
      hover: {
        animationDuration: 1
      }, 
      animation: {
        duration: 1,
        onComplete: function () {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = isStacked ? 'right' : 'left';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              var data = dataset.label;
              const oldFont = ctx.font;
              ctx.font = '8pt Montserrat'
              ctx.fillStyle = dataset.textColor;
              if (isStacked) {
                if (ctx.measureText(data).width < (bar._model.x - bar._model.base)) {
                  ctx.fillText(data, bar._model.x - 5, bar._model.y + 5);
                }
              } else {
                ctx.fillText(data, bar._model.x + 5, bar._model.y + 5);
              }
              ctx.font = oldFont;
            });
          });
        }
      },
      scales: {
        xAxes: [
          {
            stacked: isStacked,
            ticks: {
              beginAtZero: true,
              callback: (value) => moneyFormat.format(value),
              autoSkipPadding: 40,
              maxRotation: 0,
            }
          }],
        yAxes: [{
          gridLines: {
            display: false,
          },
        }]
      },
      legend: false,
      maintainAspectRatio: false,
    }
  });
}

makeChart(document.getElementById('mySpendingChart'), spendingChartData, false);
makeChart(document.getElementById('myFundingChart'), fundingChartData, true);
makePieChart(document.getElementById('myPieChart'), spendingChartData);

