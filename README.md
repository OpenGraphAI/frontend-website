# OpenGraph AI Frontend

A polished TypeScript web app for OpenGraph AI: a multimodal knowledge-graph platform designed to help AI agents reason over real-world context instead of isolated chunks of text.

## What this project does

This repository powers the public-facing experience for OpenGraph AI. It brings together:

- a marketing landing page that explains the product and value proposition,
- an interactive playground that visualizes entities, relationships, and citations,
- a guided walkthrough of the ingestion and graph-building pipeline,
- a resources and use-case experience for developers and teams,
- and a Supabase-backed experience for auth, graph export, and saved work.

In short, this frontend shows how multimodal inputs such as documents, tables, audio, images, and other sources can be transformed into a queryable context graph for agents.

## Product highlights

- Multimodal storytelling: the site frames OpenGraph AI as a context layer for reasoning agents.
- Interactive discovery: the playground lets visitors explore a sample graph with nodes, edges, and source material.
- Pipeline education: the app explains the flow from ingesting data to extracting entities and relationships to querying them.
- Agent-friendly positioning: it emphasizes workflows for RAG replacement, research agents, enterprise memory, and other graph-backed AI use cases.

## Tech stack

This app is built with a modern React stack:

- Vite for development and builds
- React 19 + TypeScript
- TanStack Router and TanStack Start for routing and SSR
- TanStack Query for client-side data handling
- Tailwind CSS with shadcn/ui-style primitives
- Framer Motion for animated UI transitions
- Supabase for authentication and storage-backed graph features

## Repository structure

- src/routes — route-level pages such as the home page, playground, how-it-works, resources, auth, and authenticated graph views
- src/components — reusable UI sections, animated visuals, and playground-specific experience components
- src/lib — shared utilities, mock graph data, server config, and error handling helpers
- src/integrations — Supabase clients and middleware for browser/server use
- supabase — database migrations and project config

## What to look at first

If you are new to this codebase, a good order is:

1. src/routes/index.tsx — the main website experience and product narrative
2. src/routes/playground.tsx — the interactive graph explorer
3. src/routes/how-it-works.tsx — the pipeline explanation
4. src/integrations/supabase — the auth/storage integration layer

## Notes

This repository is the frontend experience for OpenGraph AI. It focuses on the product story, interactive UI, and the user journey around building and exploring graph-backed context for agents.
