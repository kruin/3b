3B LINE CONFIGURATOR — VERSION 23
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

Terminology: LKL is the Pattern; FIVE, SIX etc. are Lines; Nose through Leg are
Parts. Values use compact cycle buttons, so mobile does not open a numeric
keyboard. Fixed rail directions mirror automatically with West/East. Leg A is
one continuous corner zone: North 20–40 followed by East 0–80. The mirrored
view uses North 20–0 followed by West 0–80. One Leg therefore covers both
former leg variants.
Line 1 is always the first departure line and supports dragging plus 1 cm
precision buttons and desktop arrow keys.

Every cushion ball is one shared point: arrival A of the preceding part and
departure V of the following part. Drag that ball along the cushion to
recalculate and save both adjacent diamond values together. The cue ball keeps
its separate function: dragging it changes the physical length of Line 1.

On touchscreens, draggable balls have a larger invisible hit area and a visible
dashed halo. Normal page scrolling remains available until a ball drag starts;
only during that drag is page scrolling blocked.

For reliable mobile editing, tap a cushion ball to open a fixed control panel
with −10, −1, +1 and +10. Direct dragging remains available but is no longer
required. Shared-ball steps recalculate both adjacent values together.

The direct manipulation zone of a shared cushion ball includes the ball, its
arrival A label and the following departure V label. Touching or dragging
anywhere in that outlined zone operates the same ball along the cushion.

Mobile two-finger drag: keep one finger pressed on the ball+A+V zone, then
drag with a second finger anywhere on the screen. Release both when ready.
The fixed step buttons remain available for precise adjustment.

Line 1 variants
---------------
- Base keeps the configured Line 1 unchanged.
- Parallel shift creates names such as FIVE+1 or SIX-1. Start and arrival move
  by the same physical diamond step, so Line 1 does not rotate. FIVE+1 is
  displayed from Z+1 to W60 when base FIVE runs from Z to W50.
- Fan keeps Z fixed and rotates Line 1. FIVE-AND-A-HALF / HALFZES is halfway
  between the configured Line 1 arrivals of FIVE and SIX. It is not estimated
  while either arrival is missing.

Publication
-----------
Use Publiceer_3B.bat. See PUBLICEREN.md and KLANT-INSTRUCTIE.md.
