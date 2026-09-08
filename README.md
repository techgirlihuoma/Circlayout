# Perfboard Layout Tool

Open-source web app that helps hobbyists and students plan component placement
on perfboard for soldering. Drag and drop components, link pins without
worrying about arrangement, then press "Arrange" to generate a layout that
minimizes wire length, respects power/signal separation, and eliminates
solder-lead crossovers (falling back to clearly marked jumper wires only
where a crossover is truly unavoidable).

## Packages

- `packages/core` — board model, geometry, and the simulated-annealing
  placement/routing optimizer. Pure logic, no UI dependencies.
- `packages/components` — JSON part definitions (resistor, LED, capacitor,
  DIP IC, header) with per-pin net-class tagging.
- `packages/web` — React + TypeScript + Konva frontend.

## Status

Early scaffold — see `perfboard-layout-tool-v1-spec.md` for the full v1
architecture and build order.

## Development

```
npm install
npm run dev
```

## License

MIT
