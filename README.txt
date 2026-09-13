3B LINE CONFIGURATOR — VERSION 13
================================

Open index.html locally or use https://kruin.github.io/3b/.
English is the default language; Dutch is selectable on screen.

Configuration
-------------
- Tables: Large, Small or Both.
- Direction: West (canonical default) or East (mirrored view).
- Route: Nose, or Shortened four-cushion.
- When Shortened four-cushion is selected, Nose disappears and Head becomes
  the first visible part using Head's configured V and A.
- Correction can be Advice, On or Off. It uses the absolute Head length in cm
  to calculate an indicative running-English percentage. It never changes V/A.
- Parts: Nose, Head, Neck, Body, Cross and Leg.
- In Both mode, “Edit table” determines which table the form edits.

Both playing fields are displayed at the same size. Physical dimensions remain
115 × 230 cm and 142 × 284 cm. Diamond lines stay 9.5 cm outside the cushion;
the diamonds and numbering are drawn on the brown wood.

Data
----
Changes are stored only in this browser under 3b-canonical-west-v2.
“My tables” / “Mijn tafels” downloads a JSON backup. Import restores it.
SVG downloads the visible drawing(s).

Drawing style: no arrows; the thick route has the scaled 61.5 mm ball width.
Filled balls sit against the cushion. Thin construction lines continue from
each ball centre to V/A on the diamond lines. Nose also extends backwards from
Z to the diamond line; the shortened route uses Head V for that guide.

Diamond values have two configured display modes. “At each guide” keeps the
regular numbering and adds exact labels such as Head · A 19. “Replace nearest
number” suppresses the nearest regular multiple of ten and shows the exact
coloured V/A label at the actual line point.

By default, a diamond-line label contains only the exact value, such as 15.
Ball colour (white/yellow) and marking (plain/spotted) are configurable.
The cue ball can be dragged along the first visible departure route. Its
position and stroke length are saved per table, system and shot view.

Publication
-----------
Use Publiceer_3B.bat. See PUBLICEREN.md and KLANT-INSTRUCTIE.md.
