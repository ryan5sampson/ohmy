# Ohmy

A daily circuit puzzle. Every box is a voltage, current, or resistance in the
circuit. Fill them all in with Ohm's law and the series and parallel rules, the
way you'd fill in a Sudoku.

- Three daily puzzles: Easy (whole numbers), Medium (one decimal place), and
  Hard (two decimal places). Everyone gets the same three each day.
- Practice puzzles in three types: Classic (battery voltage and every
  resistance), Mixed (any mix of values), and Meter (too few clues, so you
  measure the fewest values you can to reach par).
- Every puzzle has a code, like `MX-7K3Q9`. Open `…/#MX-7K3Q9` to play that
  exact puzzle.

It's a static site: `index.html` (the game) and `ohmy.js` (the puzzle engine).
No build step and no dependencies.

## Check the engine

```sh
node check.js
```

This generates 540 puzzles and checks that each one follows the physics, stays
within its decimal places, and is solvable by logic alone. Meter puzzles are
checked the other way: they must not be solvable until you measure something.

Changing the generator changes which puzzle a code opens, so shared codes and
past dailies stop matching.
