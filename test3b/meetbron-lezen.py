"""Lees de gedeelde Kruin-sheet rechtstreeks; behoud notatie en celverwijzingen.

Dit script importeert niets in de actieve spoorwaarden. Het bewaart de bron voor
vergelijking, zodat een leeg vak of '?' nooit stilzwijgend een meetwaarde wordt.
"""
import argparse
import datetime
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen

SHEET = "https://docs.google.com/spreadsheets/d/1CKztHLnXb4BX_3fngsVrye9j1ynxPRpGB3YRG22J0xI/edit"
TABS = {
    "groot": ("LKL GROOT", "130350200"),
    "raedthuys": ("Raedthuys-Ingespeeld", "1691958707"),
    "klein-ingespeeld": ("Klein-Ingespeeld", "89506246"),
    "klein-nieuw": ("v 0.1- nieuw laken", "836382332"),
}


def column_name(number):
    result = ""
    while number:
        number, remainder = divmod(number - 1, 26)
        result = chr(65 + remainder) + result
    return result


class Grid(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.row = None
        self.cell = None
        self.covered = set()
        self.cells = {}

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if tag == "table" and "waffle" in attributes.get("class", "").split():
            self.active = True
        if not self.active:
            return
        if tag == "tr":
            self.row = []
        if tag in ("th", "td") and self.row is not None:
            self.cell = [tag, attributes, []]
        if tag == "br" and self.cell is not None:
            self.cell[2].append("\n")

    def handle_data(self, data):
        if self.cell is not None:
            self.cell[2].append(data)

    def handle_endtag(self, tag):
        if not self.active:
            return
        if tag in ("th", "td") and self.cell is not None:
            self.row.append(self.cell)
            self.cell = None
        if tag == "tr" and self.row is not None:
            self.store_row()
            self.row = None
        if tag == "table":
            self.active = False

    def store_row(self):
        if not self.row or self.row[0][0] != "th":
            return
        label = "".join(self.row[0][2]).strip()
        if not label.isdigit():
            return
        row_number, column = int(label), 1
        for tag, attributes, text in self.row[1:]:
            if tag != "td":
                continue
            while (row_number, column) in self.covered:
                column += 1
            width = int(attributes.get("colspan", 1))
            height = int(attributes.get("rowspan", 1))
            value = "".join(text).strip()
            if value:
                self.cells[f"{column_name(column)}{row_number}"] = value
            for y in range(row_number, row_number + height):
                for x in range(column, column + width):
                    if (y, x) != (row_number, column):
                        self.covered.add((y, x))
            column += width


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--html-dir", type=Path,
                        help="Lees eerder rechtstreeks opgehaalde sheet-<naam>.html")
    parser.add_argument("--output", type=Path,
                        default=Path(__file__).parent / "meetgegevens" / "kruin-sheet-bron.json")
    args = parser.parse_args()
    result = {
        "source": SHEET + "?usp=drive_link",
        "readAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "status": "bronopname; interpretatie en import zie kruin-wijzigingen.json",
        "requestedProfiles": {
            "klein-ingespeeld": {"size": "klein", "default": True},
            "klein-nieuw": {"size": "klein", "default": False},
            "raedthuys": {"size": "groot", "compareWith": "groot"},
        },
        "tabs": {},
    }
    for key, (title, gid) in TABS.items():
        url = SHEET + "?usp=drive_link&gid=" + gid
        if args.html_dir:
            html = (args.html_dir / f"sheet-{key}.html").read_text()
        else:
            with urlopen(url, timeout=30) as response:
                html = response.read().decode("utf-8")
        grid = Grid()
        grid.feed(html)
        if not grid.cells:
            raise ValueError(f"Geen leesbare cellen in {title}; controleer toegang.")
        result["tabs"][key] = {"title": title, "gid": gid, "url": url, "cells": grid.cells}
        print(f"{title}: {len(grid.cells)} gevulde broncellen")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
