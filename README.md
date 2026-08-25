# Network Explorer

Turn a CSV into a social network, explore it, measure it, and export a
publication-quality figure — entirely in the browser. No install, no server, no
account, and **your data never leaves your computer**: the file is read locally
by JavaScript and nothing is uploaded anywhere.

Built for historians, sociologists and anyone whose data lives in a spreadsheet
rather than in a graph database.

**[▶ Open the tool](https://kashi-noam.github.io/network-explorer/)**
*(live once GitHub Pages is switched on — see “Running it” below)*

---

## What it does

**1 · Reads two shapes of table.** Most tools assume you already have an edge
list. Real spreadsheets often do not.

| Your table | Choose | What happens |
|---|---|---|
| `person_a, person_b, year` — one row per relationship | **Edge list** | Each row becomes one edge |
| `person, document, role` — one row per membership | **Co-occurrence** | Everyone sharing a document is linked; the edge weight is the number of shared documents |

A second, optional CSV — one row per node — attaches attributes (sect, gender,
dates, place) that the edge table does not carry. They become available for
colouring, filtering and homophily.

**2 · Asks what everything means.** After the file loads you pick the node
columns, how edges should be weighted, how duplicate pairs are merged, whether
the network is directed, and which columns appear when you hover over a node or
an edge. Nothing is guessed silently.

**3 · Draws the network.** Scroll to zoom, drag to pan, drag a node to pin it in
place, double-click to release it. Click a node to light up its ego network and
dim everything else. Search by name. Four layouts: force-directed, force grouped
by community, a circle ranked by any metric, and separate clusters per category.

**4 · Measures it, with the reasoning attached.** Every metric has a short
explanation of what it counts, how to read it, and what it hides:

- degree and weighted degree
- betweenness (Brandes), closeness (Wasserman–Faust corrected)
- eigenvector, PageRank
- clustering coefficient, k-core
- Louvain communities with modularity *Q*
- graph-level: density, components, average path length, diameter,
  transitivity, degree assortativity
- **homophily / E–I index** — how often ties stay inside a category versus
  crossing it, measured against what the category sizes alone would produce

*The centrality values are checked against NetworkX; see [Accuracy](#accuracy).*

**5 · Lets you carve out a group and take it away.** Hold **Shift** and drag a
box around any set of nodes — or shift-click them one at a time, or press **▨**
to leave box-select on. From there you can grow the group to include its
neighbours, invert it, isolate it on the canvas, and download it:

- its nodes, with every metric
- the edges *inside* the group — re-uploadable into the tool as an edge list, so
  the subgroup can be analysed on its own terms
- the ties that *leave* the group, each labelled with its inside and outside end

A community can be marked on the canvas in one click, which makes the same tools
available to it.

**6 · Exports properly.**

| Format | For |
|---|---|
| **SVG** | figures in a paper — vector, stays sharp, editable in Illustrator or Inkscape |
| **PNG** at 2–6× | slides and documents |
| **CSV** | nodes with every computed metric, and the edge list |
| **Group CSVs** | the marked selection, or any single community, as nodes + edges |
| **Community CSVs** | all nodes grouped by community; all edges labelled *within* or *between*; and a one-row-per-community summary with size, internal and external ties, density, most central members and dominant attribute |
| **GEXF / GraphML** | continuing in Gephi, igraph or NetworkX |
| **Session JSON** | the mapping, every setting, the marked group and the exact node positions — reopen it to reproduce a figure precisely |
| **Methods paragraph** | a draft description of what was computed, ready to edit |

---

## Running it

Open `index.html` in a browser. That is the whole thing — one self-contained
file. To publish it: push this repository to GitHub, then **Settings → Pages →
Deploy from branch → main / (root)**.

D3 and PapaParse are loaded from a CDN, so the first load needs an internet
connection. Everything after that — parsing, layout, metrics, export — happens
locally.

### Editing it

`index.html` is generated. Edit the source and rebuild:

```
src/app.js                 the application
src/index.template.html    markup and styles
src/demo/*.csv             the built-in example dataset
build.js                   inlines the three into index.html
```

```bash
node build.js      # writes index.html — no dependencies needed
```

---

## The example dataset

**Load example dataset** builds a network from 390 attestations of 350 people in
57 Karaite marriage documents from the Cairo Geniza (10th–13th centuries), drawn
from the companion project [karaite-social-networks](https://github.com/Kashi-Noam/karaite-social-networks).
Two people are linked when they appear in the same legal document. It is a good
illustration of the co-occurrence mode, and of why the weight-threshold slider
matters: every document is a fully connected clique, so the raw graph is dense.

Sources for that data: Judith Olszowy-Schlanger, *Karaite Marriage Documents
from the Cairo Geniza* (Brill, 1998); Oded Zinger, "A Karaite-Rabbanite Court
Session," *Ginzei Qedem* 13 (2017).

---

## Accuracy

Every node-level metric was compared against
[NetworkX](https://networkx.org/) on the example dataset (338 nodes, 2,017
edges). Maximum absolute difference per node:

| metric | difference |
|---|---|
| degree | 0 |
| betweenness | 6.9 × 10⁻¹⁸ |
| closeness | 0 |
| clustering | 0 |
| k-core | 0 |
| PageRank | 2.8 × 10⁻¹³ |
| eigenvector | 6.3 × 10⁻¹³ |

Graph-level figures (density, components, diameter, average path length,
transitivity, degree assortativity) match as well.

Two conventions worth knowing:

- **Weighted distances.** When "use edge weights" is on, a heavier edge is
  treated as a *shorter* distance (`d = 1/w`) for betweenness and closeness —
  the standard reading for co-occurrence and interaction data, where a stronger
  tie means the two nodes are closer.
- **Louvain is randomised.** Re-running community detection can move borderline
  nodes between communities. Modularity *Q* stays stable; individual assignments
  near a boundary may not.

---

## Limits

- Betweenness and closeness examine every pair of nodes, so they get slow past
  a few thousand nodes. Raising the weight threshold first helps a great deal.
- A co-occurrence group with more than 400 members is skipped — it would add
  80,000 edges on its own and tell you nothing.
- Self-loops (a node linked to itself) are dropped.
- Clustering coefficient and k-core ignore edge direction.

## Licence

MIT — see `LICENSE`. The example dataset derives from copyrighted editions;
please cite Olszowy-Schlanger (1998) and Zinger (2017) if you use it.
