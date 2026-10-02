# Ohmy

A daily circuit puzzle. Every box is a voltage, current, or resistance in the
circuit. Fill them all in with Ohm's law and the series and parallel rules, the
way you'd fill in a Sudoku.

- Three daily puzzles: Easy (whole numbers), Medium (one decimal place), and
  Hard (two decimal places). Everyone gets the same three each day.
- Practice puzzles in three types: Classic (battery voltage and every
  resistance), Mixed (any mix of values), and Meter (too few clues, so you
  measure the fewest values you can to reach par).
- Expert practice puzzles nest groups four deep. Tap **Group** to bundle
  resistors and work out each group's values.
- Every puzzle has a code, like `MX-7K3Q9`. Open `…/#MX-7K3Q9` to play that
  exact puzzle.
- Resistor Rush (`…/#rush`): read and build resistor color codes against the
  clock, with a practice mode and a resistor checker.
- Symbols (`…/#symbols`): study cards for 55 schematic symbols, each with a
  description, where it's used, and a drawing of the real part. Rate how well
  you know each one, then quiz yourself.

It's a static site: `index.html` (the game), `ohmy.js` (the puzzle engine), and
`symbols.js` (the symbol cards). No build step and no dependencies.

## Check the engine

```sh
node check.js
```

This generates 720 puzzles and checks that each one follows the physics, stays
within its decimal places, and is solvable by logic alone. Meter puzzles are
checked the other way: they must not be solvable until you measure something. It also checks that every symbol card is complete.

Changing the generator changes which puzzle a code opens, so shared codes and
past dailies stop matching.
