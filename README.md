# FrameBrief Studio

A creative planning workbench that turns a brief into an editable storyboard, an abstract timed animatic, captions, and production notes. Start with the built-in template or connect a local model for a new draft.

**[Open the working demo](https://aliraza2025.github.io/framebrief-studio/)** · [Product case study](CASE_STUDY.md) · [Portfolio copy](PORTFOLIO.md)

Status: independent prototype, v0.1.0. Built by Ali Raza with AI-assisted implementation.

## What works

- Brief inputs for brand, audience, message, desired action, aspect ratio, and 15/30/60-second runtime.
- A clearly labeled, service-business campaign template requiring no model.
- Optional schema-constrained storyboard drafting with a local Ollama model.
- Editable scene titles, visual descriptions, narration, and camera direction.
- Timed abstract preview, scene navigation, and scrubbing.
- Project JSON import/export, SRT captions, SVG storyboard sheets, and Markdown production notes.

## Try the workflow

Change the brand and message, choose 15 seconds, and build a storyboard. The template produces three five-second scenes. Edit a scene's narration, jump to it in the timeline, and export SRT captions plus a storyboard SVG. Import the exported project JSON to reopen the full project.

The template's visual ideas are designed for a service-business campaign; they are not general-purpose AI generation. The timing preview uses typography and abstract compositions. It does not synthesize video, images, or audio.

## Optional local AI

The published GitHub Pages demo supports the mode that needs no model. Real model-assisted generation is available through the local Node server.

1. Install [Ollama](https://ollama.com/) from its official source and install a model that supports structured output. Check its model license and hardware requirements.
2. Start Ollama with that model available.
3. Start this repository with the exact installed model name:

```bash
OLLAMA_MODEL=your-installed-model npm start
```

Open the printed local URL and choose **Local AI** before generating. `OLLAMA_BASE_URL` optionally overrides `http://127.0.0.1:11434`. Only use an endpoint you trust: that endpoint receives the submitted brief or transcript. The browser never chooses an arbitrary model endpoint. The server binds to loopback, accepts same-origin requests, bounds request size, times out model calls, and validates the returned artifact. It does not silently substitute a template when AI fails.

The adapter follows Ollama's [chat API](https://docs.ollama.com/api/chat) and [structured-output contract](https://docs.ollama.com/capabilities/structured-outputs). No model server was available during initial verification, so the adapter and failure paths were tested using simulated HTTP responses, not live model inference. A real model's speed and output quality remain to be evaluated.

## Development

Requires Node.js 22 or newer. No npm packages, API keys, or paid services are needed for the browser demo.

```bash
npm test
npm run build
npm start
```

`public/` is the source for the browser application. `docs/` is its generated GitHub Pages version; run `npm run build` after changing the browser source. The tests use Node's built-in runner. HTTP integration tests open temporary loopback ports. CI runs the tests and verifies that the generated demo is current.

## Ownership and scope

An original independent prototype built for Ali Raza's portfolio with AI-assisted implementation. Product framing, source, sample fixtures, and interface are included in this repository. No source code, branding, assets, or employment claims were copied from Adnan Khan's projects. The repository is not affiliated with those projects or the reference libraries below.

This is a working prototype, not a customer deployment. No user interviews, revenue, adoption, business savings, or production reliability are claimed. Example records are synthetic. See [CASE_STUDY.md](CASE_STUDY.md) for the product reasoning and [PORTFOLIO.md](PORTFOLIO.md) for accurate portfolio copy.

License: [MIT](LICENSE). Model weights used with an optional local model have their own licenses.

## Limits

No footage or narration is generated. SVG sheets contain visual and caption excerpts; the full text remains in the project JSON and production notes. There is no collaborative editing, persistent cloud storage, speech alignment, or MP4 renderer. Durations are whole-second scene plans, not automatically measured speaking times. Model-generated creative direction still needs review for relevance, feasibility, accuracy, and rights clearance.

## References considered

- [Adnan Khan: media](https://adnankhan.ai/media) and [Pasht0](https://adnankhan.ai/work/pasht0): references for pairing a technical portfolio with a creative artifact. No narrative, footage, or character design copied.
- [Remotion](https://github.com/remotion-dev/remotion): reviewed for a future React video-export path. Its [license](https://github.com/remotion-dev/remotion/blob/main/packages/core/LICENSE.md) has eligibility and company-license conditions; it is not a dependency of this prototype.
- [Ollama](https://github.com/ollama/ollama), MIT: optional runtime; this repository calls its documented HTTP API and does not bundle model weights.
