# FrameBrief Studio — product case study

Stage: independent working prototype. No customer deployment or business impact is claimed.

## Problem

A creative brief often jumps straight to production before its narrative, shot requirements, and timing can be reviewed together. A small planning artifact can make those tradeoffs visible earlier.

## Contribution

Product framing, scope definition, workflow design, original implementation with AI assistance, deterministic validation, testing, documentation, and a public demo.

## Decisions and tradeoffs

1. Make the first artifact editable and exportable. A user can replace a draft instead of being locked into generated output.
2. Separate a deterministic template from actual model generation and label both modes.
3. Validate that scene durations add up to the requested runtime; malformed model responses are rejected.
4. Use abstract compositions for the animatic, keeping the prototype useful without implying that stock or synthetic footage was produced.
5. Export open text and vector formats so the work can continue in a production workflow.

## Verification

8 automated tests cover timing boundaries, all supported runtimes, subtitle endpoints, SVG escaping, invalid model output, local server behavior, and the Ollama adapter contract. A 15-second storyboard was generated in the browser; its downloaded SRT contained three cues ending at 15 seconds. Live model inference and video production were not tested.

## What would validate the product next

Create and produce one original short using the exported shot plan. Compare planned versus actual edit time, assess caption readability with viewers, and evaluate real model drafts against the template. Add a renderer only after identifying the necessary export workflow.
