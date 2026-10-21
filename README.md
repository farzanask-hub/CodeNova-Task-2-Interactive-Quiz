# Quizora — Interactive Quiz Website

A responsive multiple-choice quiz website created for the CodeNova Batch 01 Frontend Development internship (Task 2).

## Features
- Welcome screen and clear start action
- Multiple-choice questions loaded from `questions.json`
- Progress bar and question counter
- Instant correct/incorrect feedback with explanations
- Prevents duplicate answers
- Score summary with correct and incorrect counts
- Review answers and restart the quiz
- Responsive layout for mobile, tablet and desktop
- Accessible button labels, semantic HTML and reduced-motion support

## Tech Stack
- HTML5
- CSS3 (Flexbox, Grid and responsive media queries)
- Vanilla JavaScript
- JSON question bank

## Project Structure
- `index.html` — page structure
- `style.css` — styling and responsive layout
- `script.js` — quiz logic, feedback, scoring and review
- `questions.json` — question bank

## Run locally
Because the app loads `questions.json`, run it with a local web server rather than opening the HTML file directly. You can use the VS Code Live Server extension, or publish it with GitHub Pages.

## Deploy with GitHub Pages
1. Upload all four files to the root of a public GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/(root)`, then save.
5. Wait for GitHub Pages to publish the site and open the URL shown on the Pages settings screen.

## Customize
Edit `questions.json` to add or change questions. Each question should contain:
- `question`: question text
- `options`: an array of answer choices
- `answer`: zero-based index of the correct option
- `explanation`: short learning explanation

## Screenshots for submission
Capture the welcome screen, an answered question showing feedback, and the final results screen at mobile (375px), tablet (768px) and desktop (1280px or wider) widths.

## Note
Replace or expand the sample questions if your instructor expects a particular subject area. Test the published website and verify that all links work before submitting.
