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

  const p11 = {
    x: 270,
    y: 155
  };
  const p22 = {
    x: 121,
    y: 30
  };

  Viz.point(p11);
  Viz.point(p22);
  Viz.arc(p11, p22);
})();
