
Read all of this seth
# SkyCast246 — Updated website prototype

## Files
- `index.html` — website markup and floating Copilot assistant
- `style.css` — styling, animated clouds and responsive layout
- `script.js` — GTM classification, cloud learning, quiz and assistant controls

## Local setup
1. Place all three files in the same folder.
2. Open the folder in VS Code and launch `index.html` using Live Server (or another local HTTP server).
3. Internet access is required to load TensorFlow.js, the Teachable Machine model, and Copilot Studio.
4. Wait for **Cloud model ready**, upload a JPEG/PNG/WebP/GIF image under 10 MB, and click **Identify Cloud**.

## Change the GTM model
Edit `MODEL_URL` near the beginning of `script.js`. The published GTM model must be compatible with the Teachable Machine image library. Check that model class names match the `cloudData` descriptions.

## Copilot Studio
The iframe is configured in `index.html`. It displays a floating chat window when its agent/channel/authentication settings permit embedding. To change the agent, replace the `src` of the iframe with the official published webchat embed URL. **The iframe does not support programmatic sending of prompts from this site's JavaScript.** Users can copy the prepared prompt from the Ask Copilot tab and paste it into the chat. For automatic handoff, implement a supported authenticated Copilot Studio integration; do not expose access tokens in client-side JS.

## Deployment
Upload the three files to a static web host. Visitors can access the website URL without installing VS Code. Chatbot access is controlled separately by Copilot Studio authentication and institutional policies.

## Testing checklist (record actual results before marking pass)
| Test | Expected result | Actual result |
|---|---|---|
| Desktop layout | Upload and prediction side by side | Not yet recorded |
| Mobile layout | Panels stack, no horizontal overflow | Not yet recorded |
| Valid image | Preview appears and Identify enables after model load | Not yet recorded |
| Invalid file | Status explains valid image required | Not yet recorded |
| File over 10 MB | Status rejects file | Not yet recorded |
| Model unavailable | Error status, Identify disabled | Not yet recorded |
| Identify image | Ranked predictions and cloud information appear | Not yet recorded |
| New image | Previous prediction is cleared | Not yet recorded |
| Suggested question | Populates question tab and opens assistant | Not yet recorded |
| Custom question | Populates question tab and opens assistant | Not yet recorded |
| Floating assistant | Opens and closes; Escape closes | Not yet recorded |
| Copilot response | Published agent loads and answers manually pasted prompt | Not yet recorded |
| Quiz | Feedback shown, next question works | Not yet recorded |

## Documentation note
Add real dates, screenshots, observed outcomes and team-member remarks to your project logbook. Do not record untested functionality as passed.

## Light and dark mode
Both pages load `theme.js`. The theme toggle in the header saves the user's selection in browser localStorage (when available). Without a saved preference, the browser/system appearance is used.

## About Us page
Open `about.html` from the navigation. To replace an illustrated avatar with a team photo, save the photo in PNG format and overwrite the matching file in `images/`: `joyella.png`, `seth.png`, `christopher.png`, or `kai.png`. Use a square crop with the face centered. The page applies the circular crop automatically. The About page uses the same `style.css` and `theme.js` as the home page.

## Additional testing
- Toggle light/dark on both pages; verify preference survives navigation and refresh.
- Check both themes at phone and desktop widths, including quiz correct/wrong states and prediction results.
- Check that the About Us navigation and return-to-home link work.
- The Microsoft-hosted chatbot iframe may not follow the website theme.

## Project team
- Joyella Williams — Project Manager
- Seth Jervier — Programmer
- Christopher Clarke — Documentalist
- Kai Murrell — Programmer

The About Us page lists confirmed names and roles. Add individual contributions or photos only when provided by the team.

## AI assistant on About Us
The floating Copilot Studio assistant is also embedded in `about.html`. The About page loads `about-chat.js` for open/close, navigation and Escape-key interactions. Do not load `script.js` on the About page: it expects homepage-only cloud identification elements. Both pages use the same published Copilot Studio iframe URL, and access is still subject to the agent's authentication and publishing permissions. Test both pages separately.
