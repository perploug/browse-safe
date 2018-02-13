const Grid = {
  init(config) {
    this.rowsCount = config.rows || 100;
    this.colsCount = config.cols || 100;
    this.canvas = config.canvas;
    this.context = config.context;
    this.width = config.width;
    this.height = config.height;

    this.drawGrid();
  },

  drawGrid() {
    const context = this.context;
    const rowStep = this.width / this.rowsCount;
    const colStep = this.height / this.colsCount;

    for (let x = 0, i = 0; x <= this.rowsCount; x++, i += rowStep) {
      context.moveTo(x + i, 0);
      context.lineTo(x + i, this.height);
    }

    for (let x = 0, i = 0; x <= this.colsCount; x++, i += colStep) {
      context.moveTo(0, x + i);
      context.lineTo(this.width,  x + i);
    }

    context.strokeStyle = "black";
    context.stroke();
  }
};
