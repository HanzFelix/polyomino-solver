# Polyomino Solver

[![Website](https://img.shields.io/badge/Website-polyomino--solver.pages.dev-blue.svg)](https://polyomino-solver.pages.dev/)

An interactive, browser-based tool for solving and visualizing polyomino tiling puzzles. It provides all possible puzzle solutions, given a set of polyomino pieces to be placed in a board.

## Features

- Define the shape and size of the tiling area, up to a 12 $\times$ 12 board size.
- Define quantities of monominoes, dominoes, trominoes, tetrominoes, pentominoes of the problem, as well as user-created polyominoes.
- Automatically solve tiling puzzles, providing visualizations of each of the unique solutions found.

## Usage

To try the solver, visit the hosted site: https://polyomino-solver.pages.dev/

For local development:

1. Clone the repository.

```bash
git clone https://github.com/HanzFelix/polyomino-solver.git
cd polyomino-solver
```

2. Install dependencies.

```bash
pnpm install
```

3. Run the development server.

```bash
pnpm dev
```

4. Open the app in your browser, at http://localhost:5173/.

5. Use the interface to define pieces and tiling area, and generate solutions.
