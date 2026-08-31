# Web Development Learning Assistant

## 1. Project Brief

Web Development Learning Assistant is an AI-powered learning application designed for students and developers who want help learning, understanding, debugging, and improving web applications. It uses Google's Gemini model to provide focused assistance on HTML, CSS, JavaScript, TypeScript, React, Next.js, APIs, accessibility, performance, debugging, architecture, and deployment. I chose this project to create a practical learning tool that provides focused AI assistance rather than functioning as a general-purpose chatbot.

## 2. Live Application

https://week-4-task-2-ai-chat.vercel.app/

## 3. GitHub Repository

https://github.com/badarjamal62/week-4-task-2-ai-chat

## 4. Testing Evidence

- Test files: 3 passed
- Tests: 14/14 passed
- Overall coverage: 76.62%
- Required coverage: ≥50%
- Result: PASS

Evidence: `testing-coverage.png`

## 5. Lighthouse Evidence

- Performance: 99/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100
- Required minimum: 85
- Result: PASS

Evidence: `lighthouse.png`

## 6. Accessibility Evidence

Final axe DevTools audit:

- Total issues: 0
- Critical: 0
- Serious: 0
- Moderate: 0
- Minor: 0
- WCAG 2.1 AA: 0 issues

Evidence: `accessibility-axe.png`

## 7. Deployment Checklist

- [x] Application builds successfully
- [x] Application deployed to Vercel
- [x] Production URL verified
- [x] Gemini AI integration implemented
- [x] Environment variable configured
- [x] Error handling implemented
- [x] Invalid requests handled
- [x] Missing API configuration handled
- [x] AI request failures handled
- [x] Unit tests implemented
- [x] All 14 tests passing
- [x] Coverage exceeds 50%
- [x] Lighthouse audit completed
- [x] Accessibility audit completed
- [x] README completed
- [x] GitHub repository updated
- [x] Production deployment verified

## 8. Rollback and Monitoring

### Rollback Plan

The application is deployed through Vercel from the main Git branch. If a production deployment introduces a problem, the previous known-working Git commit can be redeployed through Vercel. Git history provides previous versions of the application, allowing the deployment to be restored to a known working state.

### Monitoring

Production health is monitored through the Vercel deployment status and by testing the live application. Server-side AI failures are logged for debugging, while the API route returns explicit error responses when requests are invalid, the Gemini API configuration is missing, or an AI request cannot be completed.

## 9. Reflection

The hardest part of this project was making the application reliable beyond the basic AI functionality. Integrating the Gemini API required handling request validation, API configuration, streaming responses, and failures rather than assuming every request would succeed. I also had to pay attention to chat scrolling, responsive layout, accessibility, testing, and production deployment.

If I were doing the project again, I would plan the testing and accessibility requirements earlier instead of treating them as final-stage tasks. I would also add more end-to-end tests for the complete user flow and improve production monitoring.

One thing I learned that surprised me was how much production readiness depends on areas outside the main feature. Building the AI chat was only one part of the project. Testing, accessibility, performance, error handling, deployment, rollback planning, and documentation were also necessary to make the application ready for real users.