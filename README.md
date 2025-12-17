Web Application Test — Google Books Search 
Web application developed as a technical test.  
It allows users to search for books through the Google Books API, view results in a responsive layout, and access detailed information through modals with high‑definition images.

Main Features:

- Real‑time book search using the Google Books API  
- Dynamic results with title, author, description, and cover image  
- Detailed book modal with HD image and extended information  
- Personal library management (add/remove)  
- Responsive UI with clean layout and modular components  
- Optimized UX with smooth loading and visual feedback  
- Modular architecture (separate JS files for UI, API, modals, and library)

Project Structure:
 
Web_Application_Test_Folgori/
│
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── googleBooks.js
│       ├── myBooks.js
│       ├── modals.js
│       └── ui.js
│
├── views/
│   ├── index.ejs
│   └── partials/
│       ├── header.ejs
│       ├── footer.ejs
│       ├── search.ejs
│       ├── modal_details.ejs
│       ├── styles.ejs
│       └── scripts.ejs
│
├── server.js
├── package.json
├── package-lock.json
└── .gitignore
 
Technologies Used:

- Node.js + Express  
- EJS templating  
- Bootstrap  
- Modular JavaScript  
- Google Books API  
- Responsive CSS  

Project Setup:

- Install dependencies: npm install
- Development mode: npm run dev
- Production mode: npm start
- The server will be available at: http://localhost:3000

Useful Links:

- GitHub Repository:
  https://github.com/MartinaFolgori/Web_Application_Test_Folgori

- CodeSandbox (online version): 
  https://codesandbox.io/p/github/MartinaFolgori/Web_Application_Test_Folgori/main?file=%2FREADME.md%3A2%2C1&import=true&workspaceId=ws_6MP34vyvMprFccWNjcmZq4

Development Notes:

- The project was developed locally and then imported into GitHub in a single final commit.  
- The structure was designed to be modular and easily extendable.  
- Manual testing was performed on UX, modals, HD images, and library management.  
- The code was refined and cleaned before delivery.