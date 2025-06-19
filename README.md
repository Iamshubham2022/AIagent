# E-commerce Pre-Sales Conversational AI Agent

A modern, responsive customer service chatbot for e-commerce order status and cancellation support. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Order Status Lookup:** Customers can check the status, ETA, and items of their order by providing an order ID.
- **Order Cancellation:** Customers can request to cancel an order, provide a reason, and receive a return ID and instructions.
- **Conversational Flow:** Step-by-step, context-aware conversation with intent recognition and follow-up support.
- **Error Handling:** Friendly, SOP-compliant responses for invalid order IDs, API errors, and out-of-scope requests.
- **Responsive Design:** Works beautifully on desktop, tablet, and mobile devices.
- **Mock API:** Simulates real-world API calls and error scenarios for demo purposes.

## Demo

![screenshot](demo-screenshot.png)

## Standard Operating Procedure (SOP) Summary

### Order Status Inquiry
1. Greet and recognize intent.
2. Collect and validate order ID.
3. Retrieve order status (mock API).
4. Respond with status, ETA, and items in customer-friendly language.
5. Offer further assistance.
6. Handle errors (invalid ID, API error) with empathetic, actionable messages.

### Order Cancellation
1. Recognize cancellation intent.
2. Collect and validate order ID.
3. Check eligibility (delivered, shipped, processing).
4. Collect cancellation reason.
5. Process cancellation (mock API) and provide return ID and instructions.
6. Offer further assistance.
7. Handle errors and escalate to human agent if needed.

### Out-of-Scope Requests
- Politely redirect to appropriate resources, but always offer help with order status or cancellation.

## Tech Stack
- **React 18** + **TypeScript**
- **Vite** (fast dev/build tooling)
- **Tailwind CSS** (utility-first styling)
- **lucide-react** (icon set)
- **@tanstack/react-query** (future-proofing for real API integration)
- **clsx** and **tailwind-merge** (class utilities)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)

### Installation

```bash
# Clone the repository
https://github.com/your-username/aiagent-customer-service.git
cd aiagent-customer-service

# Install dependencies
npm install
```

### Running the App

```bash
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   ├── Hero.tsx
│   │   ├── DemoInstructions.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       └── card.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── .gitignore
└── README.md
```

## Customization & Extending
- Replace mock API logic in `ChatInterface.tsx` with real API calls for production.
- Adjust SOP, error messages, and escalation logic as needed for your business.
- Style and brand the UI to match your e-commerce platform.

## License

MIT

---

**Built with ❤️ for modern e-commerce support.**
