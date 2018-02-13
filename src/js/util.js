const util = {
  getCanvas() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();

    return {
      canvas,
      context,
      width,
      height
    };
  },

  getPointDistance(p1, p2) {
    const px = p2.x - p1.x;
    const pxSquare = px * px;
    const py = p2.y - p1.y;
    const pySquare = py * py;
    const d = pxSquare + pySquare;

    return Math.sqrt(d);
  },

  getMidPoint(p1, p2) {
    const x = (p2.x + p1.x) / 2;
    const y = (p2.y + p1.y) / 2;

    return {
      x,
      y
    };
  }
};
