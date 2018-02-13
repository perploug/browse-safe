const Viz = {
  init(config) {
    this.canvas = config.canvas;
    this.context = config.context;
    this.pointRadius = 5;
    this.pointColor = 'red';
  },

  point(p) {
    const { x, y } = p;

    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
    this.context.fillStyle = this.pointColor;
    this.context.closePath();
    this.context.fill();
  },

  arc(p1, p2) {
    const { x, y } = util.getMidPoint(p1, p2);
    const radius = util.getPointDistance(p1, p2);

    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.arc(x, y, radius/2, 0, 2 * Math.PI);
    this.context.fillStyle = 'blue';
    this.context.closePath();
    this.context.fill();
  }
};
