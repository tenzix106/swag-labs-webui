# SauceDemo Test Automation — Playwright + TypeScript

An end-to-end test automation framework for [SauceDemo](https://www.saucedemo.com),
built with Playwright and TypeScript to demonstrate modern web test automation practices.

## Overview

This project showcases:
- **Page Object Model (POM)** architecture for maintainable, scalable test design
- **UI test coverage** across authentication, product sorting, and cart/checkout flows
- **API testing** using Playwright's built-in request context
- **CI/CD integration** with automated test runs on every push
- **Cross-browser support** via Playwright's multi-engine test runner

## Why this project

This framework was built as a hands-on migration from a Selenium WebDriver
(Java, Cucumber/BDD) automation background, exploring how modern tools like
Playwright simplify synchronization, locator strategy, and test authoring
while retaining the same core testing principles: maintainability,
readability, and reliable CI integration.

## Tech Stack

- **Playwright** — browser automation and API testing
- **TypeScript** — type-safe test authoring
- **GitHub Actions** — CI pipeline
- **HTML Reporter** — built-in test reporting

## Getting Started

\`\`\`bash
npm install
npx playwright install
npm test
\`\`\`
