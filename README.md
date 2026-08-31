# Web Development Learning Assistant


**Live Application:** https://week-4-task-2-ai-chat.vercel.app/

## Project Overview

The Web Development Learning Assistant is a production-ready AI-powered frontend application designed to help users learn, understand, debug, and improve web applications. It provides focused assistance on web-development topics including HTML, CSS, JavaScript, TypeScript, React, Next.js, APIs, accessibility, performance, debugging, architecture, and deployment. The application was built to provide practical, streaming AI responses while handling invalid requests and API failures safely.

## Features

* AI-powered web development assistance using Google Gemini
* Streaming AI responses
* Focused web-development system prompt
* Suggested questions for common web-development topics
* Markdown response rendering
* GitHub-flavored Markdown support
* Code block support
* Responsive interface
* Accessible semantic HTML structure
* User and assistant message distinction
* Input validation
* API request validation
* API error handling
* Missing API-key detection
* Automated unit/component testing
* Accessibility testing with axe DevTools
* Lighthouse performance and quality auditing
* Production deployment

## Tech Stack

### Frontend

* Next.js 16.3.1
* React 19.2.8
* TypeScript
* React Markdown
* Remark GFM

### AI

* Google Gemini
* `@ai-sdk/google`
* Vercel AI SDK
* `@ai-sdk/react`

### Testing

* Vitest
* Testing Library
* jsdom
* `@vitest/coverage-v8`

### Development

* Node.js
* npm
* Git
* GitHub

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js 18 or later
* npm
* Git

### Installation

Clone the repository and install the dependencies:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_DIRECTORY>
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

The API key must be kept in the server environment and should not be exposed in client-side code.

### Run the Development Server

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Project Architecture

The application follows a Next.js App Router structure.

```text
app/
├── api/
│   └── chat/
│       ├── route.ts
│       └── route.test.ts
├── chat/
│   ├── ChatInterface.tsx
│   ├── chat.module.css
│   └── ...
├── globals.css
├── layout.tsx
├── page.tsx
└── page.module.css

lib/
└── ai/
    └── config.ts

src/
└── components/
    └── test/
        ├── ChatInterface.test.tsx
        └── SuggestedQuestions.test.tsx
```

### Main Responsibilities

**`app/chat/ChatInterface.tsx`**

Handles the main chat interface, user input, message rendering, suggested questions, AI response display, and chat interaction behavior.

**`app/api/chat/route.ts`**

Acts as the server-side API endpoint for chat requests. It validates incoming requests, converts messages to the model format, sends them to Gemini, streams the response, and handles API errors.

**`lib/ai/config.ts`**

Configures the Google Gemini model and contains the system prompt that defines the assistant's purpose and allowed subject area.

**`app/chat/chat.module.css`**

Contains the styling for the chat interface and its components.

**Test files**

Contain automated tests for the API route and frontend components.

## AI Integration

The application uses Google's Gemini model through the Vercel AI SDK. The frontend sends chat messages to the `/api/chat` endpoint, where the server validates the request and converts the messages into the model format before sending them to Gemini.

The application uses the `gemini-3.6-flash` model with a dedicated system prompt that defines the assistant as a Web Development Learning Assistant. The prompt limits responses to meaningful web-development topics such as HTML, CSS, JavaScript, TypeScript, React, Next.js, APIs, databases, accessibility, performance, debugging, architecture, and deployment.

Responses are streamed back to the frontend using `streamText()`, allowing users to see the response as it is generated rather than waiting for the entire response to finish.

The API route also validates incoming JSON and message structure and returns explicit errors for invalid requests, missing API configuration, and failed Gemini requests.

### How the AI Works

The request flow is:

```text
User
  ↓
Chat Interface
  ↓
/api/chat
  ↓
Request validation
  ↓
Message conversion
  ↓
Gemini model
  ↓
Streaming response
  ↓
Chat Interface
```

The API key is accessed server-side through the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.

### System Prompt

The system prompt defines the model as a Web Development Learning Assistant.

The assistant is instructed to provide meaningful help with:

* HTML
* CSS
* JavaScript
* TypeScript
* React
* Next.js
* Tailwind CSS
* Frontend development
* Backend development for web applications
* Node.js
* APIs and HTTP
* Web application databases
* Authentication and authorization
* Responsive web design
* Accessibility
* Web performance
* Browser fundamentals
* Debugging
* Web application architecture
* Deployment

Questions unrelated to web development are intentionally not handled as general-purpose questions.

### API Route

The `/api/chat` endpoint performs several validation steps before making an AI request.

It verifies:

1. The request body contains valid JSON.
2. The request body is an object.
3. A non-empty messages array is provided.
4. Each message contains the expected ID, role, and text part.
5. The Gemini API key is configured.

After validation, the messages are converted using the Vercel AI SDK and passed to Gemini through `streamText()`.

## Error Handling

The application includes explicit error handling for common failure cases.

| Situation                | Response           |
| ------------------------ | ------------------ |
| Invalid JSON             | HTTP 400           |
| Invalid request body     | HTTP 400           |
| Missing/invalid messages | HTTP 400           |
| Missing Gemini API key   | HTTP 500           |
| Gemini request failure   | HTTP 500           |
| Streaming error          | Logged server-side |

The frontend also provides an error state when the chat request fails so the user is not left without feedback.

## Testing

Automated tests are implemented using Vitest and Testing Library.

### Test Results

The final test run produced:

```text
Test Files  3 passed (3)
Tests       14 passed (14)
```

Tested areas include:

* Chat API route
* Chat interface
* Suggested questions

All automated tests passed successfully.

### Coverage

The final coverage report produced:

```text
Statements: 76.62%
Branches:   71.18%
Functions:  72.72%
Lines:      76.62%
```

The capstone requirement is a minimum coverage of 50%, so the project exceeds the required threshold.

Important component coverage includes:

```text
ChatInterface.tsx       72.72% statements
SuggestedQuestions.tsx  100% statements
API route               84.21% statements
```

Run the tests with:

```bash
npm test -- --run
```

Run tests with coverage using:

```bash
npm test -- --run --coverage
```

## Accessibility

Accessibility was tested using axe DevTools against the application.

### axe DevTools

Final accessibility audit result:

```text
Total Issues:      0
Automatic Issues:  0
Guided Issues:     0
Manual Issues:     0
Critical:          0
Serious:           0
Moderate:          0
Minor:             0
WCAG 2.1 AA:       0 issues
```

The application also uses semantic elements such as headings, labels, buttons, forms, articles, and ARIA attributes where appropriate.

## Performance

The production application was audited using Google Lighthouse.

Final Lighthouse results:

| Category       |       Score |
| -------------- | ----------: |
| Performance    |  **99/100** |
| Accessibility  | **100/100** |
| Best Practices | **100/100** |
| SEO            | **100/100** |

The lowest Lighthouse score is 99, which exceeds the capstone requirement of 85.

The Lighthouse audit was performed against the deployed application.

## Deployment

The application is deployed as a production Next.js application.

### Production URL


Live Application: https://week-4-task-2-ai-chat.vercel.app/


### Deployment Requirements

The production environment requires:

```text
GOOGLE_GENERATIVE_AI_API_KEY
```

The API key should be configured through the deployment platform's environment-variable settings and must not be committed to the repository.

### Deployment Process

Production deployments are based on the `main` branch.

A typical deployment workflow is:

```text
Local changes
    ↓
Run tests
    ↓
Run production build
    ↓
Commit changes
    ↓
Push to main
    ↓
Production deployment
    ↓
Verify live application
```

## Known Limitations

* The assistant is intentionally limited to web-development-related questions.
* AI responses depend on the availability and behavior of the Gemini service.
* The application requires a valid Gemini API key for AI responses.
* AI-generated answers can contain inaccuracies and should be reviewed when used for important technical decisions.
* The current application does not provide user authentication or persistent user accounts.
* Conversation persistence is not implemented as a database-backed feature.

## Future Improvements

Potential future improvements include:

* Persistent conversation history
* User authentication
* Conversation management
* More extensive end-to-end testing
* Expanded test coverage
* Improved monitoring and error reporting
* Rate limiting for API requests
* Additional AI model/provider options
* More advanced developer-focused tools
* Improved observability for production AI requests

## Rollback Plan

The GitHub `main` branch is the source of truth for production deployments.

If a production deployment introduces a regression:

1. Identify the problematic commit.
2. Revert the problematic commit in Git.
3. Run the automated tests locally.
4. Run the production build.
5. Push the verified rollback commit to `main`.
6. Allow the deployment platform to deploy the reverted version.
7. Verify the production application after deployment.

For an emergency rollback, the deployment platform's previous successful deployment can also be restored when supported.

The application should be verified after every rollback to ensure that the chat interface, API endpoint, AI responses, and error handling are functioning correctly.

## Production Readiness Summary

The application has been tested and audited against the major capstone requirements:

* AI integration implemented with Google Gemini
* Streaming AI responses implemented
* API request validation implemented
* Error handling implemented
* Automated tests implemented
* 14/14 tests passing
* 76.62% overall statement/line coverage
* Accessibility audit completed with 0 reported issues
* Lighthouse Performance: 99
* Lighthouse Accessibility: 100
* Lighthouse Best Practices: 100
* Lighthouse SEO: 100
* Production deployment completed
* Git repository maintained through GitHub

## Reflection

The most challenging part of the project was making the AI chat experience reliable beyond the basic successful-response case. Integrating the AI model required handling request validation, message conversion, streaming responses, missing configuration, and API failures rather than treating the AI service as a simple text-generation function.

Another important challenge was testing behavior that depends on asynchronous AI responses. The project required separating the user-facing chat behavior from the external AI service so that the interface and API behavior could be tested consistently.

The project also demonstrated that production readiness involves more than making the main feature work. Accessibility, performance, testing, error handling, deployment, and documentation all have to be considered together.

If I developed the project again, I would introduce broader automated end-to-end testing earlier in the development process and establish production monitoring and rate limiting from the beginning. I would also plan persistent conversation storage if the application were expanded into a larger product.

One thing I learned from the project is that a small application can have many production-level concerns. The AI response itself is only one part of the system; validation, failure states, accessibility, performance, testing, and deployment determine whether the application is actually usable and maintainable.

## Project Brief

The Web Development Learning Assistant is an AI-powered learning application for developers and students who need practical help with web development. It uses Google Gemini to explain concepts, answer technical questions, and assist with debugging across technologies such as HTML, CSS, JavaScript, React, and Next.js. The idea was chosen to create a focused AI application that provides a meaningful development-learning use case rather than functioning as a general-purpose chatbot.
