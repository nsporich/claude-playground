# Director Agent Design

**Date:** 2026-02-23
**Goal:** Create an orchestrator agent that triages user requests and deploys the right specialist agent, so users don't need to memorize agent names.

## Problem

Users must know agent names and roles to invoke them. As the roster grows, this becomes a memorization burden. We need a single entry point that understands natural language requests and routes to the right agent.

## Design

### Identity

- **Name:** Director
- **Title:** The Commander — assembles the right team for any mission
- **Tags:** orchestration, triage, routing
- **Features:** subagents
- **Requires:** no skills (pure delegation)
- **Suggests:** all other agents (dynamic discovery)

### Workflow

**Phase 1: Assess the Mission**
- User describes task in natural language
- Director scans ~/.claude/skills/ for installed agents
- Reads each AGENT.md frontmatter (name, description, tags)
- Matches request to best-fit agent
- If ambiguous, asks a clarifying question

**Phase 2: Deploy**
- Invokes the chosen agent's skill
- Agent takes full control and runs its complete workflow
- Director is hands-off during execution

**Phase 3: Debrief**
- After agent completes, Director returns
- Surfaces the previous agent's `suggests` handoffs as recommendations
- Offers to deploy the next agent or accept a new mission
- "Mission complete. What's next, commander?"

### Dynamic Roster Discovery

Director does not hardcode agent names. On each invocation:
1. Scan ~/.claude/skills/ for directories containing AGENT.md
2. Read frontmatter: name, description, tags, suggests
3. Build roster of available agents
4. Match user's request against descriptions and tags

Automatically adapts when agents are added or removed.

### Installation

- Always installed by the installer (not optional)
- Works with whatever agents are available
- Users can still invoke agents directly by name

### What Director Does NOT Do

- Run agent workflows itself (pure delegation)
- Manage subagents or coordinate between them
- Require any specific agents to be installed
