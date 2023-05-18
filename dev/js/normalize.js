import * as vg from '../setup.js';

export default async function(el) {
  const {
    coordinator, Param, plot, from, lineY, ruleX, text, textX, nearestX,
    yScale, yDomain, yGrid, yTickFormat, yLabel, xLabel,
    width, height, marginRight, sql, argmax, max, column, Query
  } = vg;

  const point = Param.value(new Date('2013-05-13'));
  const table = 'stocks';
  const label = 'labels';
  const d = column('Date');
  const v = column('Close');
  const s = column('Symbol');
  const x = d;
  const y = sql`${v} / (
    SELECT MAX(${v}) FROM ${table} WHERE ${s} = source.${s} AND ${d} = ${point}
  )`;

  const q = Query
    .select({ Date: max(d), Close: argmax(v, d) }, s)
    .from(table)
    .groupby(s);
  await coordinator().exec(`
    DROP TABLE IF EXISTS stocks;
    DROP TABLE IF EXISTS labels;
    CREATE TEMP TABLE stocks AS SELECT * FROM '${location.origin}/data/stocks.csv';
    CREATE TEMP TABLE labels AS ${q};
  `);

  el.appendChild(
    plot(
      ruleX({ x: point }),
      textX({ x: point, text: point, frameAnchor: 'top', lineAnchor: 'bottom', dy: -7 }),
      text(from(label), { x, y, dx: 2, text: s, fill: s, textAnchor: 'start' }),
      lineY(from(table), { x, y, stroke: s }),
      nearestX({ as: point }),
      yScale('log'), yDomain([0.2, 6]), yGrid(true),
      xLabel(null), yLabel(null), yTickFormat('%'),
      width(650), height(400), marginRight(35)
    )
  );
}