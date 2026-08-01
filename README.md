# legal-text

A dataset of legal language for describing or requiring deliberative processes.

It collects examples of deliberative or participatory democratic processes that
have been institutionalised in legal text. For each, we record the country, the
current operational status, the nature of the institutionalisation, and excerpts
of the relevant legal language — both the clauses that design the process and
the clauses that give it binding force.

The dataset is published at
**[ai-democracy.org/deliberation-in-legal-text](https://ai-democracy.org/deliberation-in-legal-text)**,
which reads `data/legal_text.json` from this repository directly. A merged pull
request appears on the site within a few minutes; no site rebuild is needed.

## Contributing

Additions and corrections are welcome — open a pull request against
`data/legal_text.json`.

The file is a JSON array with **one record per line**. Please keep it that way:
it is what makes pull request diffs readable. Records are unsorted; append new
ones at the end.

Every claim should be supported by the `links` field, ideally pointing at the
primary legal source rather than reporting about it.

Don't worry about getting the formatting exactly right — we will tidy anything
up before merging.

Contributions are accepted on the terms in [Rights and reuse](#rights-and-reuse)
below.

## Schema

Each record is an object with these fields.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `example` | string | yes | Name of the process, e.g. `"Scottish Parliament's Citizens Panels"`. |
| `country` | string | yes | Used as a filter on the site, so reuse an existing spelling where one applies (`"UK"`, not `"United Kingdom"`). |
| `year` | number | yes | Year of the institutionalisation. |
| `status` | string | yes | One of `"Operational"`, `"Not operational"`, `"Proposed"`. The site colour-codes these. |
| `nature_of_institutionalization` | string (markdown) | yes | Prose describing how and how firmly the process is embedded in law. |
| `legal_text_process_design` | array of tabs, or `null` | no | Excerpts of the legal text that *designs* the process. `null` or omitted if there is none. |
| `legal_text_binding` | array of tabs | yes | Excerpts of the legal text that *requires* the process. Use `[]` if there is none. |
| `links` | string (markdown) | yes | Canonical sources, as a markdown list of links. |

A **tab** is an object with two string fields:

```json
{ "tab": "English", "text": "**Source citation**\n\nQuoted legal text..." }
```

`tab` names the language of the excerpt (`"English"`, `"French"`, `"Korean"`, …)
and becomes a tab label in the site's table. Where the original text is not in
English, include the original alongside an English translation. `text` is
markdown; use `\n\n` between paragraphs and bold the source citation on the
first line.

The markdown fields (`nature_of_institutionalization`, `links`, and each tab's
`text`) are rendered as markdown on the site, so links, emphasis and lists all
work.

### Example record

```json
{"example": "Ostbelgien Bürgerrat", "country": "Belgium", "year": 2019, "status": "Operational", "nature_of_institutionalization": "Permanent, established by decree of the Parliament of the German-speaking Community.", "legal_text_process_design": [{"tab": "German", "text": "**Dekret vom 25. Februar 2019**\n\nArtikel 2 ..."}, {"tab": "English", "text": "**Decree of 25 February 2019**\n\nArticle 2 ..."}], "legal_text_binding": [{"tab": "English", "text": "**Decree of 25 February 2019, Article 18**\n\n..."}], "links": "[Decree text](https://example.org/decree)"}
```

## Rights and reuse

This dataset is dedicated to the public domain under [CC0 1.0](LICENSE)
([plain-language summary](https://creativecommons.org/publicdomain/zero/1.0/)).
Use it for anything, without permission or attribution. Contributions are
accepted on the same terms.

CC0 disposes only of rights the dedicating party actually holds. Here that means
the parts we made: the choice of which examples to include, their arrangement,
the descriptive prose, and the English translations we produced. It leaves the
status of the quoted legal text exactly as it was.

**Quoted legal text.** Excerpts are reproduced from official government sources,
linked in each record. Most of the jurisdictions represented here place official
legislative texts outside copyright altogether: the Berne Convention (Art. 2(4))
leaves the question to each country, and Germany, Italy, Spain, Austria,
Belgium, Japan and South Korea, among others, have excluded them by statute, as
has the United States under the government edicts doctrine. Where copyright is
asserted — the Crown copyright jurisdictions, notably the UK and Ireland — the
legislation is published for reuse under open terms such as the Open Government
Licence. Nothing here enlarges or restricts whatever rights exist in those
underlying texts, and reusers relying on a particular excerpt should check its
linked source.

**Translations.** English text shown alongside a non-English original is either
an official language version published by the source body, or an unofficial
translation produced with the assistance of AI. The latter have not been
verified line by line by a lawyer or a professional translator. Treat any
translated excerpt as a guide to the original rather than as authoritative:
where something turns on the precise wording, work from the original-language
tab and the linked source.

**Citation.** Not required, but appreciated, and it helps people find
corrections:

> AI & Democracy Foundation, *Deliberation clauses in legal text*.
> https://github.com/AI-Democracy-Foundation/legal-text

## Disclaimer

This dataset is a research resource, not legal advice.
