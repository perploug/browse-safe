(() => {
  const { canvas, context, width, height } = util.getCanvas();

  Grid.init({
    rows: 30,
    cols: 30,
    canvas,
    context,
    width,
    height
  });

  Viz.init({
    canvas,
    context
  });

  const p1 = {
    x: 27,
    y: 55
  };
  const p2 = {
    x: 221,
    y: 300
  };

  Viz.point(p1);
  Viz.point(p2);
  Viz.arc(p1, p2);
})();
