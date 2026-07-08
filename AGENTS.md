# SYNORA Frontend AI Development Guide

## Project Overview

SYNORA is an AI Software Company Platform.

This repository contains only the frontend application.

Responsibilities of the frontend:

- Render UI
- Handle user interaction
- Consume Backend REST API
- Manage client-side state

Business logic must always stay in the backend.

Never move business rules into the frontend.

---

# Tech Stack

Framework

- Next.js 15 (App Router)
- React 19
- TypeScript

Styling

- Tailwind CSS
- shadcn/ui

State Management

- Zustand (Global State)
- TanStack Query (Server State)

Forms

- React Hook Form
- Zod

Icons

- Lucide React

Notifications

- Sonner

---

# Architecture

Use Feature-Based Architecture.

Directory Structure

src/

app/

features/

components/

hooks/

providers/

services/

types/

utils/

lib/

Never organize business code by page.

Keep business logic inside features.

---

# Routing

Use Next.js App Router.

Never use Pages Router.

All routes must be inside src/app.

---

# API Rules

Frontend communicates ONLY with Go Backend.

Never connect directly to database.

Never place fetch() inside UI components.

Every API request must go through:

features/{feature}/services/

Example

features/projects/services/project.service.ts

---

# State Management

Server State

TanStack Query

Global State

Zustand

Local State

React Hooks

Never use Context API as global state.

---

# Forms

Every form must use

React Hook Form

+

Zod

Never manually validate forms.

---

# Components

Components should be reusable.

Business logic should never exist inside UI components.

Pages only compose components.

Prefer components under 300 lines.

Split when necessary.

---

# Styling

Tailwind CSS only.

Use shadcn/ui as base component library.

Never use:

- Bootstrap
- Material UI
- Ant Design

Never use inline styles.

---

# Icons

Lucide React only.

Do not mix icon libraries.

---

# Authentication

JWT Authentication.

Protected routes use middleware.

Public Routes

/login

/register

Landing Page (future)

/forgot-password (future)

---

# Loading States

Every page must support

- Skeleton Loading
- Error State
- Empty State
- Success State

---

# Tables

Reusable Table Component.

Support

Search

Pagination

Sorting

Empty State

Loading

---

# Code Style

Prefer readability.

Keep components small.

One responsibility per component.

Avoid duplicate code.

Avoid premature abstraction.

Consistency is more important than personal preference.

---

# UI Consistency

Never redesign components that already exist.

Always reuse:

Buttons

Inputs

Cards

Dialogs

Tables

Badges

Sidebar

Navbar

Layout

Never change the design system unless explicitly instructed.

---

# Goal

Build a scalable, maintainable, enterprise-grade frontend.

When unsure, prioritize consistency over creativity.