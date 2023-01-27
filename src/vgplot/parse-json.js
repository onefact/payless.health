import { Signal, Selection } from '../mosaic/index.js';
import { avg, count, expr, max, median, min, mode, quantile, sum } from '../sql/index.js';
import { bin, dateMonth, dateMonthDay, dateDay } from './transforms/index.js'

import { from } from './directives/data.js';
import * as plots from './directives/plots.js';
import * as marks from './directives/marks.js';
import * as inputs from './directives/inputs.js';
import * as selections from './directives/selections.js';
import * as attributes from './directives/attributes.js';
import { Fixed } from './symbols';

export const DefaultParams = new Map([
  ['intersect', () => Selection.intersect()],
  ['crossfilter', () => Selection.crossfilter()],
  ['union', () => Selection.union()],
  ['value', v => new Signal(v)]
]);

export const DefaultParsers = new Map([
  ['plot', { type: isArray, parse: parsePlot }],
  ['hconcat', { type: isArray, parse: parseHConcat }],
  ['vconcat', { type: isArray, parse: parseVConcat }],
  ['hspace', { type: isNumber, parse: parseHSpace }],
  ['vspace', { type: isNumber, parse: parseVSpace }],
  ['input', { type: isString, parse: parseInput }]
]);

export const DefaultTransforms = new Map([
  ['avg', avg],
  ['bin', bin],
  ['count', count],
  ['dateMonth', dateMonth],
  ['dateMonthDay', dateMonthDay],
  ['dateDay', dateDay],
  ['bin', bin],
  ['max', max],
  ['median', median],
  ['min', min],
  ['mode', mode],
  ['quantile', quantile],
  ['sum', sum]
]);

export const DefaultInputs = new Map(Object.entries(inputs));
export const DefaultAttributes = new Map(Object.entries(attributes));
export const DefaultSelections = new Map(Object.entries(selections));

export function parseJSON(spec, options) {
  spec = isString(spec) ? JSON.parse(spec) : spec;
  return new JSONParseContext(options).parse(spec);
}

export class JSONParseContext {
  constructor({
    parsers = DefaultParsers,
    params = DefaultParams,
    transforms = DefaultTransforms,
    selections = DefaultSelections,
    attributes = DefaultAttributes,
    inputs = DefaultInputs,
    namespace
  } = {}) {
    this.specParsers = parsers;
    this.paramParsers = params;
    this.transforms = transforms;
    this.selections = selections;
    this.attributes = attributes;
    this.inputs = inputs;
    this.namespace = namespace ? new Map(namespace) : new Map;
  }

  maybeParam(value, ctr = () => new Signal()) {
    const { namespace } = this;
    const name = paramRef(value);

    if (name) {
      if (!namespace.has(name)) {
        const p = ctr();
        namespace.set(name, p);
        return p;
      } else {
        return namespace.get(name);
      }
    }
    return value;
  }

  maybeSelection(value) {
    return this.maybeParam(value, () => Selection.intersect());
  }

  maybeTransform(value) {
    if (isObject(value)) {
      if (value.expr) {
        return expr(value.expr, [], value.label);
      } else {
        const { transforms } = this;
        const [ key ] = Object.keys(value);
        const fn = transforms.get(key);
        if (fn) {
          const args = key === 'count' ? [] : [value[key]].flat();
          return fn(...args);
        }
      }
    }
  }

  parse(input) {
    const { namespace } = this;
    const { data, params, ...spec } = input;

    // TODO: parse data definitions

    // parse param (signal/selection) definitions
    for (const name in params) {
      namespace.set(name, parseParam(params[name], this));
    }

    return parseSpec(spec, this);
  }
}

function parseParam(param, ctx) {
  param = isObject(param) ? param : { value: param };
  const { type = 'value', value } = param;
  const parser = ctx.paramParsers.get(type);
  if (!parser) {
    error(`Unrecognized param type: ${type}`, param);
  }
  return parser(value);
}

function parseSpec(spec, ctx) {
  for (const [key, { type, parse }] of ctx.specParsers) {
    const value = spec[key];
    if (value != null) {
      if (type(value)) {
        return parse(spec, ctx);
      } else {
        error(`Invalid property type: ${key}`, spec);
      }
    }
  }
  error(`Invalid specification.`, spec);
}

function parseHSpace(spec) {
  return plots.hspace(+spec.hspace);
}

function parseVSpace(spec) {
  return plots.vspace(+spec.vspace);
}

function parseInput(spec, ctx) {
  const { input, ...options } = spec;
  const fn = ctx.inputs.get(input);
  if (!isFunction(fn)) {
    error(`Unrecognized input: ${input}`, spec);
  }
  for (const key in options) {
    options[key] = ctx.maybeSelection(options[key]);
  }
  return fn(options);
}

function parseVConcat(spec, ctx) {
  return plots.vconcat(spec.vconcat.map(s => parseSpec(s, ctx)));
}

function parseHConcat(spec, ctx) {
  return plots.hconcat(spec.hconcat.map(s => parseSpec(s, ctx)));
}

function parsePlot(spec, ctx) {
  const { plot, ...attributes } = spec;

  const attrs = Object.keys(attributes)
    .map(key => parseAttribute(spec, key, ctx));

  const entries = plot.map(e => parseEntry(e, ctx));

  return plots.plot(attrs, entries);
}

function parseAttribute(spec, name, ctx) {
  const fn = ctx.attributes.get(name);
  if (!isFunction(fn)) {
    error(`Unrecognized attribute: ${name}`, spec);
  }
  const value = spec[name];
  const arg = value === 'Fixed' ? Fixed : ctx.maybeParam(value);
  return fn(arg);
}

function parseEntry(spec, ctx) {
  return isString(spec.mark) ? parseMark(spec, ctx)
    : isString(spec.select) ? parseSelection(spec, ctx)
    : error(`Invalid plot entry.`, spec);
}

function parseMark(spec, ctx) {
  const { mark, data, ...options } = spec;

  const fn = marks[mark];
  if (!isFunction(fn)) {
    error(`Unrecognized mark type: ${mark}`, spec);
  }

  const input = parseMarkData(data, ctx);
  for (const key in options) {
    options[key] = parseMarkOption(options[key], ctx);
  }

  return input ? fn(input, options) : fn(options);
}

function parseMarkData(spec, ctx) {
  if (!spec) return null;
  const { from: table, ...options } = spec;
  for (const key in options) {
    options[key] = ctx.maybeSelection(options[key]);
  }
  return from(table, options);
}

function parseMarkOption(spec, ctx) {
  return ctx.maybeTransform(spec) || ctx.maybeParam(spec);
}

function parseSelection(spec, ctx) {
  const { select, ...options } = spec;
  const fn = ctx.selections.get(select);
  if (!isFunction(fn)) {
    error(`Unrecognized selection type: ${select}`, spec);
  }
  for (const key in options) {
    options[key] = ctx.maybeSelection(options[key]);
  }
  return fn(options);
}

// -----

function paramRef(value) {
  const type = typeof value;
  return type === 'object' ? value?.param
    : type === 'string' ? paramStr(value)
    : null;
}

function paramStr(value) {
  return value?.[0] === '$' ? value.slice(1) : null;
}

function isArray(value) {
  return Array.isArray(value);
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function isNumber(value) {
  return typeof value === 'number';
}

function isString(value) {
  return typeof value === 'string';
}

function isFunction(value) {
  return typeof value === 'function';
}

function error(message, data) {
  throw Object.assign(Error(message), { data });
}