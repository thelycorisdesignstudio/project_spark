// ─── Curriculum Data ───────────────────────────────────────────────
// 5 Worlds, 6 Missions each, 3 Stages per Mission = 90 Stages total
// ───────────────────────────────────────────────────────────────────

export interface Stage {
  id: number;
  title: string;
  brief: string;
  starterCode: { html?: string; css?: string; js?: string; python?: string };
  validationFn: string;
  xpReward: number;
}

export interface Mission {
  id: number;
  title: string;
  questBrief: string;
  estimatedMinutes: number;
  xpReward: number;
  badgeSlug?: string;
  stages: Stage[];
}

export interface World {
  id: number;
  name: string;
  tagline: string;
  narrative: string;
  language: 'html' | 'python';
  color: string;
  icon: string;
  badgeSlug: string;
  xpBonus: number;
  missions: Mission[];
}

export const CURRICULUM: World[] = [
  // ═══════════════════════════════════════════════════════════════════
  // WORLD 1 — The Web Kingdom (HTML/CSS)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 1,
    name: 'The Web Kingdom',
    tagline: 'Build your first pages and rule the web',
    narrative:
      'The Web Kingdom has fallen silent. Its pages are blank, its colors gone. You must restore it.',
    language: 'html',
    color: '#7C3AED',
    icon: '🏰',
    badgeSlug: 'world-1',
    xpBonus: 500,
    missions: [
      // ── Mission 1: The First Page ──────────────────────────────
      {
        id: 1,
        title: 'The First Page',
        questBrief:
          'The Web Kingdom needs a herald. Create a page that tells the world who you are using headings, paragraphs, and a proper page title.',
        estimatedMinutes: 15,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Set the Page Title',
            brief:
              'Every page needs a title — it shows up in the browser tab. Add a <title> tag inside <head> so the browser tab shows your name.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <!-- Add your title here -->\n  </head>\n  <body>\n    <!-- Your content goes here -->\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M1_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Add a Heading',
            brief:
              'Now add a big heading using <h1>. Make it your name or your page title — this is the first thing people will see!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <!-- Add your heading here -->\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M1_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Write a Paragraph',
            brief:
              'Add a <p> tag with a sentence about yourself. Your first real webpage is almost done!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Welcome</h1>\n    <!-- Add your paragraph here -->\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M1_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 2: Images & Portals ────────────────────────────
      {
        id: 2,
        title: 'Images & Portals',
        questBrief:
          'The kingdom needs decorations and doorways! Add images and links to connect your pages to the wider web.',
        estimatedMinutes: 15,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Add an Image',
            brief:
              "Use an <img> tag to add a picture to your page. Every image needs a src (where the picture lives) and an alt (what to say if the picture can't load).",
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>My Gallery</title></head>\n  <body>\n    <h1>My Favorite Things</h1>\n    <!-- Add an image here with src and alt -->\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M2_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Create a Link',
            brief:
              'Links are portals to other pages! Use an <a> tag with an href to create a clickable link.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>My Gallery</title></head>\n  <body>\n    <h1>My Favorite Things</h1>\n    <img src="https://via.placeholder.com/200" alt="A placeholder">\n    <!-- Add a link here -->\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M2_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Build a List',
            brief:
              'Organize your favorite things into a list using <ul> and <li> tags. Lists keep your page tidy!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>My Gallery</title></head>\n  <body>\n    <h1>My Favorite Things</h1>\n    <img src="https://via.placeholder.com/200" alt="A placeholder">\n    <a href="https://example.com">Visit Example</a>\n    <!-- Add a list of 3 items here -->\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M2_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 3: The Royal Wardrobe ──────────────────────────
      {
        id: 3,
        title: 'The Royal Wardrobe',
        questBrief:
          'The kingdom looks plain! Time to dress it up with CSS — change colors, fonts, and make your text look amazing.',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Change Colors',
            brief:
              'Use CSS to change the color of your heading and the background-color of your page. CSS is the stylist for your webpage!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Styled Page</title>\n    <style>\n      /* Add your CSS styles here */\n    </style>\n  </head>\n  <body>\n    <h1>My Colorful Page</h1>\n    <p>This page is about to look amazing!</p>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M3_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Style Your Text',
            brief:
              'Make your text bigger, bolder, or centered! Use font-size, font-weight, and text-align in CSS.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Styled Page</title>\n    <style>\n      body { background-color: #1E293B; }\n      h1 { color: #7C3AED; }\n      /* Add more styles to the paragraph */\n    </style>\n  </head>\n  <body>\n    <h1>My Colorful Page</h1>\n    <p>Style me with font-size, font-weight, and text-align!</p>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M3_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Add Hover Effects',
            brief:
              'Make your links change color when you hover over them using the :hover selector. Interactive styles make pages feel alive!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Styled Page</title>\n    <style>\n      body { background-color: #1E293B; color: #F0F4FA; }\n      h1 { color: #7C3AED; font-size: 32px; }\n      p { font-size: 18px; text-align: center; }\n      a { color: #0891B2; }\n      /* Add a:hover style here */\n    </style>\n  </head>\n  <body>\n    <h1>My Colorful Page</h1>\n    <p>Hover over the link below!</p>\n    <a href="#">Magic Link</a>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M3_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 4: Boxes & Castles ─────────────────────────────
      {
        id: 4,
        title: 'Boxes & Castles',
        questBrief:
          'Everything on the web is a box! Learn the box model — borders, margins, and padding — to build castle walls around your content.',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Build a Box',
            brief:
              'Create a <div> and give it a border, some padding, and a background color. Every element on a webpage is a box!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Box Model</title>\n    <style>\n      /* Style the .castle-wall div */\n    </style>\n  </head>\n  <body>\n    <div class="castle-wall">\n      <h2>Welcome to the Castle</h2>\n      <p>This content lives inside a box!</p>\n    </div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M4_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Add Spacing',
            brief:
              'Use margin to add space OUTSIDE your box and padding to add space INSIDE. Think of padding as cushions and margin as a moat!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Box Model</title>\n    <style>\n      .castle-wall {\n        border: 3px solid #7C3AED;\n        background-color: #F0F4FA;\n        color: #1E293B;\n        /* Add padding and margin here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="castle-wall">\n      <h2>Welcome to the Castle</h2>\n      <p>Add some breathing room!</p>\n    </div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M4_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Round the Corners',
            brief:
              'Use border-radius to round the corners of your box and add box-shadow to make it float! Your castle is looking premium now.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Box Model</title>\n    <style>\n      .castle-wall {\n        border: 3px solid #7C3AED;\n        background-color: #F0F4FA;\n        color: #1E293B;\n        padding: 24px;\n        margin: 20px;\n        /* Add border-radius and box-shadow */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="castle-wall">\n      <h2>Welcome to the Castle</h2>\n      <p>Looking smooth!</p>\n    </div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M4_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 5: The Royal Profile ───────────────────────────
      {
        id: 5,
        title: 'The Royal Profile',
        questBrief:
          "Combine everything you've learned to build a styled profile card — headings, images, colors, and the box model all working together!",
        estimatedMinutes: 25,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Card Structure',
            brief:
              'Create a profile card with an image, your name as a heading, and a short bio paragraph — all inside a styled div.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Profile</title>\n    <style>\n      body { background-color: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      .profile-card {\n        /* Style your card here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="profile-card">\n      <!-- Add image, name heading, and bio paragraph -->\n    </div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M5_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Style the Card',
            brief:
              'Make your profile card look premium — background color, border-radius, padding, box-shadow, and centered text.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Profile</title>\n    <style>\n      body { background-color: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      .profile-card {\n        background-color: #F0F4FA;\n        color: #1E293B;\n        /* Add: border-radius, padding, box-shadow, text-align, max-width */\n      }\n      .profile-card img {\n        /* Style the image: make it round! */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="profile-card">\n      <img src="https://via.placeholder.com/120" alt="My avatar">\n      <h2>Your Name</h2>\n      <p>Young coder on a mission!</p>\n    </div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M5_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Add Skills List',
            brief:
              'Add a list of your coding skills with custom colors for each item. Your Royal Profile is complete!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Profile</title>\n    <style>\n      body { background-color: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; font-family: sans-serif; }\n      .profile-card { background-color: #F0F4FA; color: #1E293B; border-radius: 20px; padding: 32px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); text-align: center; max-width: 320px; }\n      .profile-card img { width: 120px; height: 120px; border-radius: 50%; border: 3px solid #0891B2; }\n      .profile-card h2 { color: #0891B2; }\n      /* Style the skills list — remove bullets, add colored badges */\n    </style>\n  </head>\n  <body>\n    <div class="profile-card">\n      <img src="https://via.placeholder.com/120" alt="My avatar">\n      <h2>Your Name</h2>\n      <p>Young coder on a mission!</p>\n      <!-- Add a <ul> with at least 3 skill <li> items -->\n    </div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M5_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 6 (Boss): The Kingdom Portfolio ────────────────
      {
        id: 6,
        title: 'The Kingdom Portfolio',
        questBrief:
          'Your final challenge in the Web Kingdom! Build a complete multi-section portfolio with a header, about section, projects section, and footer.',
        estimatedMinutes: 30,
        xpReward: 200,
        badgeSlug: 'world-1',
        stages: [
          {
            id: 1,
            title: 'Header & Navigation',
            brief:
              'Create a header with your site title and navigation links that jump to different sections using #anchors.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Portfolio</title>\n    <style>\n      * { margin: 0; padding: 0; box-sizing: border-box; }\n      body { background-color: #FFFFFF; color: #1E293B; font-family: sans-serif; }\n      /* Style your header and nav here */\n    </style>\n  </head>\n  <body>\n    <!-- Create a <header> with a <nav> containing links -->\n    <section id="about"><h2>About</h2></section>\n    <section id="projects"><h2>Projects</h2></section>\n    <footer>Made with SPARK</footer>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M6_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'About & Projects Sections',
            brief:
              'Fill in the about section with your bio and the projects section with at least 2 project cards (divs with title and description).',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Portfolio</title>\n    <style>\n      * { margin: 0; padding: 0; box-sizing: border-box; }\n      body { background-color: #FFFFFF; color: #1E293B; font-family: sans-serif; }\n      header { background-color: #F0F4FA; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; }\n      nav a { color: #0891B2; text-decoration: none; margin-left: 16px; }\n      section { padding: 48px 32px; }\n      /* Style your project cards */\n      .project-card {\n        /* Add styles */\n      }\n    </style>\n  </head>\n  <body>\n    <header>\n      <h1 style="color: #0891B2;">My Portfolio</h1>\n      <nav><a href="#about">About</a><a href="#projects">Projects</a></nav>\n    </header>\n    <section id="about">\n      <!-- Add heading and paragraph about yourself -->\n    </section>\n    <section id="projects">\n      <h2>My Projects</h2>\n      <!-- Add at least 2 project cards -->\n    </section>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M6_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Polish & Footer',
            brief:
              'Add a styled footer, hover effects on your nav links and project cards, and make sure everything looks cohesive. Your kingdom portfolio is complete!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Portfolio</title>\n    <style>\n      * { margin: 0; padding: 0; box-sizing: border-box; }\n      body { background-color: #FFFFFF; color: #1E293B; font-family: sans-serif; }\n      header { background-color: #F0F4FA; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; }\n      nav a { color: #0891B2; text-decoration: none; margin-left: 16px; }\n      section { padding: 48px 32px; max-width: 800px; margin: 0 auto; }\n      .project-card { background: #F0F4FA; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 24px; margin: 16px 0; }\n      /* Add hover effects and footer styles */\n    </style>\n  </head>\n  <body>\n    <header>\n      <h1 style="color: #0891B2;">My Portfolio</h1>\n      <nav><a href="#about">About</a><a href="#projects">Projects</a></nav>\n    </header>\n    <section id="about">\n      <h2>About Me</h2>\n      <p>I am learning to code with SPARK!</p>\n    </section>\n    <section id="projects">\n      <h2>My Projects</h2>\n      <div class="project-card"><h3>Project 1</h3><p>A cool webpage</p></div>\n      <div class="project-card"><h3>Project 2</h3><p>An awesome game</p></div>\n    </section>\n    <!-- Add a styled <footer> -->\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W1_M6_S3',
            xpReward: 50,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 2 — The Logic Lands (JavaScript)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 2,
    name: 'The Logic Lands',
    tagline: 'Master the language of logic and interaction',
    narrative:
      'The Logic Lands are frozen in silence. Without JavaScript, nothing moves, nothing reacts. Bring logic back to the land!',
    language: 'html',
    color: '#0891B2',
    icon: '🧩',
    badgeSlug: 'world-2',
    xpBonus: 500,
    missions: [
      // ── Mission 1: The Naming Vault ────────────────────────────
      {
        id: 1,
        title: 'The Naming Vault',
        questBrief:
          'In the Naming Vault, everything has a name. Learn to create variables — containers that hold values like numbers, text, and true/false.',
        estimatedMinutes: 15,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Your First Variable',
            brief:
              'Use "let" to create a variable called myName that stores your name as a string, then display it on the page.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>The Naming Vault</title></head>\n  <body>\n    <h1>The Naming Vault</h1>\n    <p id="output">???</p>\n    <script>\n      // Create a variable called myName with your name\n\n      // Display it on the page\n      document.getElementById("output").textContent = myName;\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M1_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Numbers & Math',
            brief:
              'Create two number variables and display their sum. Variables can hold numbers too — and you can do math with them!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>The Naming Vault</title></head>\n  <body>\n    <h1>Magic Math</h1>\n    <p id="output">???</p>\n    <script>\n      // Create two number variables\n      let firstNumber = 10;\n      let secondNumber = 5;\n\n      // Create a third variable that holds their sum\n\n      // Display the result\n      document.getElementById("output").textContent = "The answer is: " + sum;\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M1_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Constants & Booleans',
            brief:
              'Use "const" for values that never change and learn about booleans (true/false). Display a message based on a boolean.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>The Naming Vault</title></head>\n  <body>\n    <h1>True or False?</h1>\n    <p id="output">???</p>\n    <script>\n      // Create a constant for the vault name (it never changes!)\n      const vaultName = "The Naming Vault";\n\n      // Create a boolean variable: is the vault open?\n\n      // Display: "The Naming Vault is open: true" (or false)\n      document.getElementById("output").textContent = vaultName + " is open: " + isOpen;\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M1_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 2: The Crossroads ──────────────────────────────
      {
        id: 2,
        title: 'The Crossroads',
        questBrief:
          'At the Crossroads, every path depends on a decision. Use if/else to choose which direction the code goes!',
        estimatedMinutes: 15,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'If/Else Gateway',
            brief:
              'Write an if/else statement that checks a number and displays whether it is positive or negative.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>The Crossroads</title></head>\n  <body>\n    <h1>Positive or Negative?</h1>\n    <p id="output">???</p>\n    <script>\n      let number = 7;\n\n      // Write an if/else:\n      // If number is greater than or equal to 0, display "Positive!"\n      // Otherwise, display "Negative!"\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M2_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Multiple Paths',
            brief:
              'Use if / else if / else to check a score and give a grade: A (90+), B (80+), C (70+), or "Keep trying!".',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>The Crossroads</title></head>\n  <body>\n    <h1>Grade Checker</h1>\n    <p id="output">???</p>\n    <script>\n      let score = 85;\n      let grade = "";\n\n      // Write if / else if / else to set grade\n      // 90+ = "A", 80+ = "B", 70+ = "C", otherwise = "Keep trying!"\n\n      document.getElementById("output").textContent = "Your grade: " + grade;\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M2_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Logical Operators',
            brief:
              'Combine conditions with && (and) and || (or). Check if a person can ride the rollercoaster (tall enough AND old enough).',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>The Crossroads</title></head>\n  <body>\n    <h1>Rollercoaster Check</h1>\n    <p id="output">???</p>\n    <script>\n      let height = 140; // in cm\n      let age = 12;\n\n      // You must be at least 120cm tall AND at least 10 years old\n      // Use && to combine both conditions in one if statement\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M2_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 3: The Loop Labyrinth ──────────────────────────
      {
        id: 3,
        title: 'The Loop Labyrinth',
        questBrief:
          'Lost in the Loop Labyrinth! Loops let you repeat actions without writing the same code over and over. Master for and while loops to escape!',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'The For Loop',
            brief:
              'Use a for loop to count from 1 to 10 and display each number on the page.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>Loop Labyrinth</title></head>\n  <body>\n    <h1>Counting with Loops</h1>\n    <p id="output"></p>\n    <script>\n      let result = "";\n\n      // Write a for loop that counts from 1 to 10\n      // Add each number to the result string\n\n      document.getElementById("output").textContent = result;\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M3_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'The While Loop',
            brief:
              'Use a while loop to double a number until it reaches at least 100. How many doublings does it take?',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>Loop Labyrinth</title></head>\n  <body>\n    <h1>The Doubling Machine</h1>\n    <p id="output"></p>\n    <script>\n      let number = 1;\n      let doublings = 0;\n\n      // Write a while loop: keep doubling "number" while it is less than 100\n      // Count how many times you doubled it\n\n      document.getElementById("output").textContent =\n        "After " + doublings + " doublings, the number is " + number;\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M3_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Loop the List',
            brief:
              'Use a for loop to go through an array of colors and create a colored square for each one on the page.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Loop Labyrinth</title>\n    <style>\n      .color-box { width: 60px; height: 60px; display: inline-block; margin: 8px; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <h1>Color Gallery</h1>\n    <div id="gallery"></div>\n    <script>\n      let colors = ["#7C3AED", "#0891B2", "#059669", "#D97706", "#DC2626"];\n\n      // Loop through the colors array\n      // For each color, create a div with class "color-box"\n      // and set its background color\n      for (let i = 0; i < colors.length; i++) {\n        // Create a div element\n        // Set its class to "color-box"\n        // Set its style.backgroundColor to colors[i]\n        // Append it to the gallery\n      }\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M3_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 4: The Recipe Hall ─────────────────────────────
      {
        id: 4,
        title: 'The Recipe Hall',
        questBrief:
          'In the Recipe Hall, you learn to write reusable recipes — functions! Give them ingredients (parameters) and get something back (return values).',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Your First Function',
            brief:
              'Create a function called greet that takes a name and returns a greeting message. Then call it and display the result!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>Recipe Hall</title></head>\n  <body>\n    <h1>The Greeting Machine</h1>\n    <p id="output">???</p>\n    <script>\n      // Create a function called greet\n      // It takes one parameter: name\n      // It returns "Hello, " + name + "!"\n\n      // Call the function and display the result\n      document.getElementById("output").textContent = greet("Spark Coder");\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M4_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Functions with Math',
            brief:
              'Create a function called calculateArea that takes width and height, returns the area. Use it to calculate areas of different rectangles.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>Recipe Hall</title></head>\n  <body>\n    <h1>Area Calculator</h1>\n    <p id="output"></p>\n    <script>\n      // Create a function called calculateArea\n      // It takes two parameters: width and height\n      // It returns width * height\n\n      // Use the function to calculate areas and display them\n      let result = "";\n      result += "Room 1: " + calculateArea(5, 3) + " sq ft\\n";\n      result += "Room 2: " + calculateArea(10, 8) + " sq ft\\n";\n      result += "Room 3: " + calculateArea(7, 7) + " sq ft";\n\n      document.getElementById("output").textContent = result;\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M4_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Functions Calling Functions',
            brief:
              'Create two functions: one that checks if a number is even, and one that builds a message. Combine them to display which numbers from 1-10 are even.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head><title>Recipe Hall</title></head>\n  <body>\n    <h1>Even Number Finder</h1>\n    <p id="output"></p>\n    <script>\n      // Create a function isEven that takes a number\n      // and returns true if it is even, false otherwise\n      // Hint: use the % (modulo) operator — number % 2 === 0 means even\n\n      // Create a function buildReport that loops from 1 to 10\n      // and builds a string like "1: odd, 2: even, 3: odd, ..."\n\n      document.getElementById("output").textContent = buildReport();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M4_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 5: The Living Page ─────────────────────────────
      {
        id: 5,
        title: 'The Living Page',
        questBrief:
          'The page is alive! Use the DOM to find elements, listen for clicks, and change what users see — all with JavaScript.',
        estimatedMinutes: 25,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Find & Change',
            brief:
              'Use document.getElementById to find an element and change its text content when a button is clicked.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Living Page</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; text-align: center; padding: 40px; }\n      button { background: #0891B2; color: #FFFFFF; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; }\n      #message { font-size: 24px; margin: 24px 0; }\n    </style>\n  </head>\n  <body>\n    <h1>The Living Page</h1>\n    <p id="message">Click the button to wake me up!</p>\n    <button id="wakeBtn">Wake Up!</button>\n    <script>\n      // Get the button element by its id\n      // Add a click event listener to it\n      // When clicked, change the text of #message to "I am awake!"\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M5_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Click Counter',
            brief:
              'Build a click counter: every time the user clicks the button, the number goes up by one. Use a variable to track the count.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Living Page</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; text-align: center; padding: 40px; }\n      button { background: #0891B2; color: #FFFFFF; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; cursor: pointer; margin: 8px; }\n      #count { font-size: 64px; color: #0891B2; }\n    </style>\n  </head>\n  <body>\n    <h1>Click Counter</h1>\n    <p id="count">0</p>\n    <button id="addBtn">+1</button>\n    <button id="resetBtn">Reset</button>\n    <script>\n      let count = 0;\n\n      // When #addBtn is clicked, increase count by 1 and update #count text\n\n      // When #resetBtn is clicked, reset count to 0 and update #count text\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M5_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Dynamic List Builder',
            brief:
              'Create an input field and button that lets users add items to a list dynamically using innerHTML or createElement.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Living Page</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; padding: 40px; max-width: 500px; margin: 0 auto; }\n      input { padding: 10px; border-radius: 8px; border: 1px solid #0891B2; background: #F0F4FA; color: #1E293B; font-size: 16px; width: 60%; }\n      button { background: #0891B2; color: #FFFFFF; border: none; padding: 10px 20px; border-radius: 8px; font-size: 16px; cursor: pointer; }\n      li { padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }\n    </style>\n  </head>\n  <body>\n    <h1>My To-Do List</h1>\n    <input id="itemInput" placeholder="Type something...">\n    <button id="addBtn">Add</button>\n    <ul id="list"></ul>\n    <script>\n      // When #addBtn is clicked:\n      // 1. Get the value from #itemInput\n      // 2. If it is not empty, create a new <li> and add it to #list\n      // 3. Clear the input field\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M5_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 6 (Boss): The Grand Quiz ───────────────────────
      {
        id: 6,
        title: 'The Grand Quiz',
        questBrief:
          'The Logic Lands final challenge! Build a fully working quiz app with questions, answers, scoring, and a results screen.',
        estimatedMinutes: 30,
        xpReward: 200,
        badgeSlug: 'world-2',
        stages: [
          {
            id: 1,
            title: 'Question Data & Display',
            brief:
              'Create an array of quiz questions (objects with question, options, and answer) and display the first question on the page.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Grand Quiz</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }\n      .option-btn { display: block; width: 100%; padding: 14px; margin: 8px 0; background: #F0F4FA; color: #1E293B; border: 1px solid #0891B2; border-radius: 10px; font-size: 16px; cursor: pointer; text-align: left; }\n      .option-btn:hover { background: #0891B2; color: #FFFFFF; }\n      #question { font-size: 22px; margin-bottom: 20px; }\n    </style>\n  </head>\n  <body>\n    <h1>The Grand Quiz</h1>\n    <p id="question">Loading question...</p>\n    <div id="options"></div>\n    <p id="score">Score: 0</p>\n    <script>\n      // Create an array called questions with at least 3 question objects\n      // Each object needs: question (string), options (array of 4 strings), answer (number 0-3)\n      // Example:\n      // { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hot Mail", "How To Make Lasagna", "High Tech Modern Language"], answer: 0 }\n\n      let currentQuestion = 0;\n      let score = 0;\n\n      // Write a function showQuestion() that displays the current question\n      // and creates buttons for each option\n\n      showQuestion();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M6_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Scoring & Navigation',
            brief:
              'When the user clicks an answer, check if it is correct, update the score, and move to the next question.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Grand Quiz</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }\n      .option-btn { display: block; width: 100%; padding: 14px; margin: 8px 0; background: #F0F4FA; color: #1E293B; border: 1px solid #0891B2; border-radius: 10px; font-size: 16px; cursor: pointer; text-align: left; }\n      .option-btn:hover { background: #0891B2; color: #FFFFFF; }\n      .correct { border-color: #059669; background: rgba(48,209,88,0.2); }\n      .wrong { border-color: #DC2626; background: rgba(255,69,58,0.2); }\n    </style>\n  </head>\n  <body>\n    <h1>The Grand Quiz</h1>\n    <p id="progress">Question 1 of 3</p>\n    <p id="question">Loading...</p>\n    <div id="options"></div>\n    <p id="score">Score: 0</p>\n    <script>\n      const questions = [\n        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hot Mail", "How To Make Lasagna", "High Tech Modern Language"], answer: 0 },\n        { question: "What symbol starts a CSS id selector?", options: [".", "#", "@", "&"], answer: 1 },\n        { question: "Which keyword creates a variable in JavaScript?", options: ["var", "let", "const", "All of the above"], answer: 3 }\n      ];\n\n      let currentQuestion = 0;\n      let score = 0;\n\n      function showQuestion() {\n        let q = questions[currentQuestion];\n        document.getElementById("question").textContent = q.question;\n        document.getElementById("progress").textContent =\n          "Question " + (currentQuestion + 1) + " of " + questions.length;\n        let optionsDiv = document.getElementById("options");\n        optionsDiv.innerHTML = "";\n        for (let i = 0; i < q.options.length; i++) {\n          let btn = document.createElement("button");\n          btn.className = "option-btn";\n          btn.textContent = q.options[i];\n          // Add a click handler that:\n          // 1. Checks if i === q.answer\n          // 2. Updates score if correct\n          // 3. Moves to next question after a short delay\n          optionsDiv.appendChild(btn);\n        }\n      }\n\n      // Write the checkAnswer(selected) function\n      // Update score display, highlight correct/wrong, then call nextQuestion\n\n      showQuestion();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M6_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Results Screen',
            brief:
              'After the last question, show a results screen with the final score, a message based on performance, and a "Play Again" button.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Grand Quiz</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; text-align: center; }\n      .option-btn { display: block; width: 100%; padding: 14px; margin: 8px 0; background: #F0F4FA; color: #1E293B; border: 1px solid #0891B2; border-radius: 10px; font-size: 16px; cursor: pointer; text-align: left; }\n      .option-btn:hover { background: #0891B2; color: #FFFFFF; }\n      .correct { border-color: #059669; background: rgba(48,209,88,0.2); }\n      .wrong { border-color: #DC2626; background: rgba(255,69,58,0.2); }\n      #result { display: none; }\n      #result h2 { font-size: 32px; color: #0891B2; }\n      .play-again { background: #059669; color: #fff; border: none; padding: 14px 32px; border-radius: 10px; font-size: 18px; cursor: pointer; margin-top: 20px; }\n    </style>\n  </head>\n  <body>\n    <div id="quiz">\n      <h1>The Grand Quiz</h1>\n      <p id="progress">Question 1 of 3</p>\n      <p id="question">Loading...</p>\n      <div id="options"></div>\n      <p id="score">Score: 0</p>\n    </div>\n    <div id="result">\n      <h2>Quiz Complete!</h2>\n      <p id="finalScore"></p>\n      <p id="message"></p>\n      <button class="play-again" id="playAgain">Play Again</button>\n    </div>\n    <script>\n      const questions = [\n        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hot Mail", "How To Make Lasagna", "High Tech Modern Language"], answer: 0 },\n        { question: "What symbol starts a CSS id selector?", options: [".", "#", "@", "&"], answer: 1 },\n        { question: "Which keyword creates a variable in JavaScript?", options: ["var", "let", "const", "All of the above"], answer: 3 }\n      ];\n\n      let currentQuestion = 0;\n      let score = 0;\n\n      function showQuestion() {\n        let q = questions[currentQuestion];\n        document.getElementById("question").textContent = q.question;\n        document.getElementById("progress").textContent = "Question " + (currentQuestion + 1) + " of " + questions.length;\n        let optionsDiv = document.getElementById("options");\n        optionsDiv.innerHTML = "";\n        for (let i = 0; i < q.options.length; i++) {\n          let btn = document.createElement("button");\n          btn.className = "option-btn";\n          btn.textContent = q.options[i];\n          btn.addEventListener("click", function() { checkAnswer(i); });\n          optionsDiv.appendChild(btn);\n        }\n      }\n\n      function checkAnswer(selected) {\n        if (selected === questions[currentQuestion].answer) {\n          score++;\n        }\n        document.getElementById("score").textContent = "Score: " + score;\n        currentQuestion++;\n        if (currentQuestion < questions.length) {\n          showQuestion();\n        } else {\n          // Show the result screen!\n          // 1. Hide #quiz, show #result\n          // 2. Set #finalScore to "You got X out of Y"\n          // 3. Set #message based on score (all correct = "Perfect!", etc.)\n          // 4. Make #playAgain reset everything and start over\n        }\n      }\n\n      // Write the showResult() function\n      // Write the playAgain click handler\n\n      showQuestion();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W2_M6_S3',
            xpReward: 50,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 3 — Animation Archipelago (CSS + JS Animations)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 3,
    name: 'Animation Archipelago',
    tagline: 'Bring motion and life to your creations',
    narrative:
      'The islands of the Animation Archipelago have stopped moving. Waves, creatures, and machines all stand still. Only you can bring motion back!',
    language: 'html',
    color: '#059669',
    icon: '🎬',
    badgeSlug: 'world-3',
    xpBonus: 500,
    missions: [
      // ── Mission 1: The Gentle Touch ────────────────────────────
      {
        id: 1,
        title: 'The Gentle Touch',
        questBrief:
          'Everything begins with a gentle touch. Learn to use CSS transitions and transforms to make elements respond when you hover over them.',
        estimatedMinutes: 15,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Smooth Color Change',
            brief:
              'Add a CSS transition so a button smoothly changes color when you hover over it instead of jumping instantly.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Gentle Touch</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      .magic-btn {\n        background: #059669;\n        color: white;\n        border: none;\n        padding: 16px 40px;\n        font-size: 20px;\n        border-radius: 12px;\n        cursor: pointer;\n        /* Add a transition property so changes animate smoothly */\n      }\n      .magic-btn:hover {\n        background: #0891B2;\n        /* The transition you added above will make this change smooth! */\n      }\n    </style>\n  </head>\n  <body>\n    <button class="magic-btn">Hover Me!</button>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M1_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Scale on Hover',
            brief:
              'Use transform: scale() to make a card grow bigger when you hover over it. Combine it with transition for a smooth effect!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Gentle Touch</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; gap: 20px; }\n      .card {\n        background: #F0F4FA;\n        color: #1E293B;\n        padding: 32px;\n        border-radius: 16px;\n        width: 200px;\n        text-align: center;\n        border: 1px solid rgba(255,255,255,0.1);\n        /* Add transition for transform */\n      }\n      .card:hover {\n        /* Add transform: scale() to make it bigger */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card"><h3>Card 1</h3><p>Hover to grow!</p></div>\n    <div class="card"><h3>Card 2</h3><p>Hover to grow!</p></div>\n    <div class="card"><h3>Card 3</h3><p>Hover to grow!</p></div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M1_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Rotate & Move',
            brief:
              'Use transform: rotate() and translateY() together to make an element spin and lift up when hovered.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Gentle Touch</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      .gem {\n        width: 100px;\n        height: 100px;\n        background: linear-gradient(135deg, #059669, #0891B2);\n        border-radius: 16px;\n        transition: transform 0.4s ease;\n      }\n      .gem:hover {\n        /* Add transform with both rotate() and translateY() */\n        /* Example: rotate(15deg) translateY(-20px) */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="gem"></div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M1_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 2: The Eternal Dance ───────────────────────────
      {
        id: 2,
        title: 'The Eternal Dance',
        questBrief:
          'Some things never stop moving. Learn @keyframes and the animation property to create loops that dance forever!',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Pulsing Glow',
            brief:
              'Create a @keyframes animation that makes a circle pulse (grow and shrink) endlessly using scale transforms.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Eternal Dance</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n\n      /* Define a @keyframes called "pulse" */\n      /* At 0% and 100%: transform: scale(1) */\n      /* At 50%: transform: scale(1.3) */\n\n      .orb {\n        width: 120px;\n        height: 120px;\n        border-radius: 50%;\n        background: radial-gradient(circle, #059669, #FFFFFF);\n        /* Add animation: pulse 2s ease-in-out infinite */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="orb"></div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M2_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Floating Island',
            brief:
              'Create an animation that makes an island float up and down smoothly using translateY. The Archipelago needs its islands to float!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Eternal Dance</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n\n      /* Define @keyframes "float" that moves up and down */\n      /* 0%, 100%: translateY(0px) */\n      /* 50%: translateY(-30px) */\n\n      .island {\n        background: #F0F4FA;\n        color: #1E293B;\n        padding: 40px 60px;\n        border-radius: 20px;\n        border: 2px solid #059669;\n        text-align: center;\n        font-size: 20px;\n        box-shadow: 0 20px 60px rgba(48,209,88,0.2);\n        /* Apply the float animation */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="island">Floating Island</div>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M2_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Spinning Loader',
            brief:
              'Create a spinning loading animation using @keyframes rotate. This is used on real websites while things load!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Eternal Dance</title>\n    <style>\n      body { background: #FFFFFF; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; margin: 0; color: #1E293B; font-family: sans-serif; }\n\n      /* Define @keyframes "spin": from 0deg to 360deg rotation */\n\n      .loader {\n        width: 60px;\n        height: 60px;\n        border: 5px solid rgba(255,255,255,0.1);\n        border-top: 5px solid #059669;\n        border-radius: 50%;\n        /* Apply spin animation: 1s linear infinite */\n      }\n      p { margin-top: 20px; font-size: 18px; }\n    </style>\n  </head>\n  <body>\n    <div class="loader"></div>\n    <p>Loading the Archipelago...</p>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M2_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 3: The Time Keepers ────────────────────────────
      {
        id: 3,
        title: 'The Time Keepers',
        questBrief:
          'The Time Keepers control when things happen. Use setTimeout and setInterval to schedule actions in JavaScript!',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Delayed Surprise',
            brief:
              'Use setTimeout to show a hidden message after 3 seconds. Some things are worth waiting for!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Time Keepers</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; text-align: center; padding: 60px; }\n      #surprise { opacity: 0; font-size: 32px; color: #059669; transition: opacity 0.5s; }\n      #surprise.visible { opacity: 1; }\n      .wait-text { font-size: 18px; color: #888; }\n    </style>\n  </head>\n  <body>\n    <h1>Wait For It...</h1>\n    <p class="wait-text">A surprise is coming in 3 seconds!</p>\n    <p id="surprise">Surprise! You found the hidden message!</p>\n    <script>\n      // Use setTimeout to add the "visible" class to #surprise after 3000ms\n      // Hint: document.getElementById("surprise").classList.add("visible")\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M3_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Live Timer',
            brief:
              'Use setInterval to build a timer that counts up every second and displays the elapsed time on the page.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Time Keepers</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; text-align: center; padding: 60px; }\n      #timer { font-size: 72px; color: #059669; font-family: monospace; }\n      button { background: #059669; color: #fff; border: none; padding: 12px 28px; border-radius: 10px; font-size: 16px; cursor: pointer; margin: 8px; }\n      .stop-btn { background: #DC2626; }\n    </style>\n  </head>\n  <body>\n    <h1>Stopwatch</h1>\n    <p id="timer">0</p>\n    <button id="startBtn">Start</button>\n    <button id="stopBtn" class="stop-btn">Stop</button>\n    <script>\n      let seconds = 0;\n      let intervalId = null;\n\n      // When #startBtn is clicked:\n      // Use setInterval to increase seconds by 1 every 1000ms\n      // Update #timer text each time\n      // Store the interval id so you can stop it later\n\n      // When #stopBtn is clicked:\n      // Use clearInterval(intervalId) to stop the timer\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M3_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Countdown Launch',
            brief:
              'Build a countdown from 10 to 0 using setInterval. When it hits 0, show "Launched!" and clear the interval.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Time Keepers</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; text-align: center; padding: 60px; }\n      #countdown { font-size: 96px; color: #D97706; font-family: monospace; transition: all 0.3s; }\n      #status { font-size: 24px; margin-top: 20px; }\n      button { background: #059669; color: #fff; border: none; padding: 14px 32px; border-radius: 10px; font-size: 18px; cursor: pointer; }\n    </style>\n  </head>\n  <body>\n    <h1>Rocket Launch</h1>\n    <p id="countdown">10</p>\n    <p id="status">Ready for launch...</p>\n    <button id="launchBtn">Start Countdown</button>\n    <script>\n      // When #launchBtn is clicked:\n      // 1. Start a setInterval that runs every 1000ms\n      // 2. Decrease the countdown number by 1 each tick\n      // 3. Update #countdown text\n      // 4. When it reaches 0, clearInterval, change #countdown to show a rocket emoji\n      //    and set #status to "Launched!"\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M3_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 4: The Moving City ─────────────────────────────
      {
        id: 4,
        title: 'The Moving City',
        questBrief:
          'In the Moving City, JavaScript controls how things look. Change styles dynamically — move, resize, and recolor elements with code!',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Color Changer',
            brief:
              'Create buttons that change the background color of the page using JavaScript style manipulation.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Moving City</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; text-align: center; padding: 60px; transition: background-color 0.5s; }\n      .color-btn { padding: 14px 28px; margin: 8px; border: none; border-radius: 10px; font-size: 16px; cursor: pointer; color: white; }\n    </style>\n  </head>\n  <body>\n    <h1>Color Changer</h1>\n    <p>Click a button to change the city\'s color!</p>\n    <button class="color-btn" style="background:#7C3AED" id="btn1">Purple</button>\n    <button class="color-btn" style="background:#0891B2" id="btn2">Cyan</button>\n    <button class="color-btn" style="background:#059669" id="btn3">Green</button>\n    <button class="color-btn" style="background:#DC2626" id="btn4">Red</button>\n    <script>\n      // For each button, add a click listener\n      // When clicked, change document.body.style.backgroundColor to that color\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M4_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Moving Box',
            brief:
              'Use JavaScript to change the position of a box. Make it move right every time a button is clicked by updating its left style.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Moving City</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; padding: 40px; }\n      #moveBox {\n        width: 80px;\n        height: 80px;\n        background: #059669;\n        border-radius: 12px;\n        position: relative;\n        left: 0px;\n        transition: left 0.3s ease;\n      }\n      button { background: #059669; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-size: 16px; cursor: pointer; margin: 8px; }\n    </style>\n  </head>\n  <body>\n    <h1>Move the Box</h1>\n    <div id="moveBox"></div>\n    <br>\n    <button id="leftBtn">Move Left</button>\n    <button id="rightBtn">Move Right</button>\n    <script>\n      let position = 0;\n\n      // When #rightBtn is clicked, increase position by 50\n      // and set moveBox.style.left = position + "px"\n\n      // When #leftBtn is clicked, decrease position by 50\n      // (but don\'t go below 0!)\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M4_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Size Slider',
            brief:
              'Use an HTML range input (slider) to dynamically change the size of a shape. Connect JavaScript to read the slider value in real time.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Moving City</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; text-align: center; padding: 60px; }\n      .shape {\n        width: 100px;\n        height: 100px;\n        background: linear-gradient(135deg, #059669, #0891B2);\n        border-radius: 50%;\n        margin: 40px auto;\n        transition: all 0.2s ease;\n      }\n      input[type="range"] { width: 300px; margin: 20px; }\n      #sizeLabel { font-size: 24px; color: #059669; }\n    </style>\n  </head>\n  <body>\n    <h1>Size Controller</h1>\n    <div class="shape" id="shape"></div>\n    <input type="range" id="sizeSlider" min="50" max="300" value="100">\n    <p id="sizeLabel">100px</p>\n    <script>\n      // Listen for the "input" event on #sizeSlider\n      // When the slider moves:\n      // 1. Get the slider\'s value\n      // 2. Set #shape width and height to that value + "px"\n      // 3. Update #sizeLabel text to show the current size\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M4_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 5: The Switchboard ─────────────────────────────
      {
        id: 5,
        title: 'The Switchboard',
        questBrief:
          'The Switchboard controls everything! Learn to toggle CSS classes to create animated menus, modals, and theme switches.',
        estimatedMinutes: 25,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Dark/Light Toggle',
            brief:
              'Create a button that toggles between dark mode and light mode by adding or removing a CSS class on the body.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Switchboard</title>\n    <style>\n      body {\n        background: #FFFFFF;\n        color: #1E293B;\n        font-family: sans-serif;\n        text-align: center;\n        padding: 60px;\n        transition: all 0.4s ease;\n      }\n      body.light-mode {\n        background: #1E293B;\n        color: #F0F4FA;\n      }\n      .toggle-btn {\n        background: #059669;\n        color: white;\n        border: none;\n        padding: 14px 32px;\n        border-radius: 50px;\n        font-size: 18px;\n        cursor: pointer;\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Theme Switcher</h1>\n    <p>Click to toggle between dark and light mode!</p>\n    <button class="toggle-btn" id="themeBtn">Toggle Theme</button>\n    <script>\n      // When #themeBtn is clicked, toggle the "light-mode" class on document.body\n      // Hint: document.body.classList.toggle("light-mode")\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M5_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Slide-In Menu',
            brief:
              'Create a side menu that slides in from the left when a button is clicked, using CSS transform and a toggled class.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Switchboard</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; margin: 0; }\n      .menu {\n        position: fixed;\n        top: 0;\n        left: -260px;\n        width: 250px;\n        height: 100%;\n        background: #F0F4FA;\n        padding: 40px 20px;\n        transition: left 0.4s ease;\n        border-right: 2px solid #059669;\n      }\n      .menu.open {\n        left: 0;\n      }\n      .menu a { display: block; color: #0891B2; padding: 12px 0; text-decoration: none; font-size: 18px; }\n      .content { padding: 40px; }\n      .menu-btn { background: #059669; color: #fff; border: none; padding: 12px 24px; border-radius: 10px; font-size: 16px; cursor: pointer; }\n    </style>\n  </head>\n  <body>\n    <nav class="menu" id="sideMenu">\n      <a href="#">Home</a>\n      <a href="#">About</a>\n      <a href="#">Projects</a>\n      <a href="#">Contact</a>\n    </nav>\n    <div class="content">\n      <button class="menu-btn" id="menuBtn">Open Menu</button>\n      <h1>The Switchboard</h1>\n      <p>Click the button to slide the menu in and out!</p>\n    </div>\n    <script>\n      // When #menuBtn is clicked, toggle the "open" class on #sideMenu\n      // Also change the button text between "Open Menu" and "Close Menu"\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M5_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Popup Modal',
            brief:
              'Build a popup modal that fades in with an overlay. Click outside or press a close button to close it.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Switchboard</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; text-align: center; padding: 60px; }\n      .overlay {\n        display: none;\n        position: fixed;\n        top: 0; left: 0; right: 0; bottom: 0;\n        background: rgba(0,0,0,0.7);\n        justify-content: center;\n        align-items: center;\n      }\n      .overlay.active {\n        display: flex;\n      }\n      .modal {\n        background: #F0F4FA;\n        padding: 40px;\n        border-radius: 20px;\n        max-width: 400px;\n        border: 1px solid #059669;\n        animation: fadeIn 0.3s ease;\n      }\n      @keyframes fadeIn {\n        from { opacity: 0; transform: scale(0.9); }\n        to { opacity: 1; transform: scale(1); }\n      }\n      .open-btn { background: #059669; color: #fff; border: none; padding: 14px 32px; border-radius: 10px; font-size: 18px; cursor: pointer; }\n      .close-btn { background: #DC2626; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; cursor: pointer; margin-top: 20px; }\n    </style>\n  </head>\n  <body>\n    <h1>Modal Magic</h1>\n    <button class="open-btn" id="openBtn">Open Modal</button>\n    <div class="overlay" id="overlay">\n      <div class="modal">\n        <h2>Secret Message!</h2>\n        <p>You discovered the hidden modal. Great job!</p>\n        <button class="close-btn" id="closeBtn">Close</button>\n      </div>\n    </div>\n    <script>\n      // When #openBtn is clicked, add "active" class to #overlay\n      // When #closeBtn is clicked, remove "active" class from #overlay\n      // BONUS: also close when clicking the overlay itself (but not the modal)\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M5_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 6 (Boss): The Animated Chronicle ───────────────
      {
        id: 6,
        title: 'The Animated Chronicle',
        questBrief:
          'Your final Archipelago challenge! Create a multi-scene animated story where each scene transitions to the next with animations, timers, and style changes.',
        estimatedMinutes: 30,
        xpReward: 200,
        badgeSlug: 'world-3',
        stages: [
          {
            id: 1,
            title: 'Scene Setup',
            brief:
              'Create three story scenes (divs) with different content. Only the first scene is visible at start. Add CSS transitions for fading in and out.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Animated Chronicle</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; margin: 0; overflow: hidden; }\n      .scene {\n        position: absolute;\n        top: 0; left: 0; right: 0; bottom: 0;\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        padding: 40px;\n        opacity: 0;\n        transition: opacity 1s ease;\n      }\n      .scene.active {\n        opacity: 1;\n      }\n      .scene h1 { font-size: 42px; margin-bottom: 20px; }\n      .scene p { font-size: 20px; max-width: 500px; text-align: center; }\n      .next-btn { background: #059669; color: #fff; border: none; padding: 14px 40px; border-radius: 50px; font-size: 18px; cursor: pointer; margin-top: 30px; }\n      /* Give each scene a different background color */\n    </style>\n  </head>\n  <body>\n    <!-- Create 3 scene divs with class "scene" -->\n    <!-- Scene 1 should also have class "active" -->\n    <!-- Each scene has: h1 title, p description, next button -->\n\n    <script>\n      // Store current scene index\n      let currentScene = 0;\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M6_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Scene Transitions',
            brief:
              'Add JavaScript to transition between scenes. When "Next" is clicked, fade out the current scene and fade in the next one.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Animated Chronicle</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; margin: 0; overflow: hidden; }\n      .scene {\n        position: absolute;\n        top: 0; left: 0; right: 0; bottom: 0;\n        display: flex; flex-direction: column;\n        justify-content: center; align-items: center;\n        padding: 40px; opacity: 0;\n        transition: opacity 1s ease;\n        pointer-events: none;\n      }\n      .scene.active { opacity: 1; pointer-events: all; }\n      .scene h1 { font-size: 42px; margin-bottom: 20px; }\n      .scene p { font-size: 20px; max-width: 500px; text-align: center; }\n      .next-btn { background: #059669; color: #fff; border: none; padding: 14px 40px; border-radius: 50px; font-size: 18px; cursor: pointer; margin-top: 30px; }\n      #scene1 { background: linear-gradient(135deg, #FFFFFF, #1a0a2e); }\n      #scene2 { background: linear-gradient(135deg, #0a2e1a, #FFFFFF); }\n      #scene3 { background: linear-gradient(135deg, #2e1a0a, #FFFFFF); }\n    </style>\n  </head>\n  <body>\n    <div class="scene active" id="scene1">\n      <h1>Chapter 1: The Beginning</h1>\n      <p>Once upon a time, in the Animation Archipelago...</p>\n      <button class="next-btn" onclick="nextScene()">Continue</button>\n    </div>\n    <div class="scene" id="scene2">\n      <h1>Chapter 2: The Journey</h1>\n      <p>The hero traveled across moving islands and dancing waves...</p>\n      <button class="next-btn" onclick="nextScene()">Continue</button>\n    </div>\n    <div class="scene" id="scene3">\n      <h1>Chapter 3: The End</h1>\n      <p>And with animation mastered, the Archipelago was alive once more!</p>\n    </div>\n    <script>\n      let currentScene = 0;\n      const scenes = document.querySelectorAll(".scene");\n\n      function nextScene() {\n        // 1. Remove "active" from current scene\n        // 2. Increase currentScene\n        // 3. Add "active" to the new scene\n        // 4. Make sure you don\'t go past the last scene!\n\n      }\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M6_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Animated Elements',
            brief:
              'Add animated elements to each scene: a pulsing orb in scene 1, a floating island in scene 2, and a spinning star in scene 3. Your chronicle is alive!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Animated Chronicle</title>\n    <style>\n      body { background: #FFFFFF; color: #1E293B; font-family: sans-serif; margin: 0; overflow: hidden; }\n      .scene {\n        position: absolute; top: 0; left: 0; right: 0; bottom: 0;\n        display: flex; flex-direction: column;\n        justify-content: center; align-items: center;\n        padding: 40px; opacity: 0;\n        transition: opacity 1s ease; pointer-events: none;\n      }\n      .scene.active { opacity: 1; pointer-events: all; }\n      .scene h1 { font-size: 42px; margin-bottom: 20px; }\n      .scene p { font-size: 20px; max-width: 500px; text-align: center; margin-bottom: 20px; }\n      .next-btn { background: #059669; color: #fff; border: none; padding: 14px 40px; border-radius: 50px; font-size: 18px; cursor: pointer; margin-top: 30px; }\n      #scene1 { background: linear-gradient(135deg, #FFFFFF, #1a0a2e); }\n      #scene2 { background: linear-gradient(135deg, #0a2e1a, #FFFFFF); }\n      #scene3 { background: linear-gradient(135deg, #2e1a0a, #FFFFFF); }\n\n      /* Add @keyframes for pulse, float, and spin */\n      /* Add styled .orb, .island-shape, and .star elements */\n      /* Apply the appropriate animation to each */\n\n    </style>\n  </head>\n  <body>\n    <div class="scene active" id="scene1">\n      <!-- Add a pulsing orb element here -->\n      <h1>Chapter 1: The Beginning</h1>\n      <p>The magic orb pulses with energy...</p>\n      <button class="next-btn" onclick="nextScene()">Continue</button>\n    </div>\n    <div class="scene" id="scene2">\n      <!-- Add a floating island element here -->\n      <h1>Chapter 2: The Journey</h1>\n      <p>The islands float peacefully in the sky...</p>\n      <button class="next-btn" onclick="nextScene()">Continue</button>\n    </div>\n    <div class="scene" id="scene3">\n      <!-- Add a spinning star element here -->\n      <h1>Chapter 3: The End</h1>\n      <p>The stars spin with joy. The Archipelago lives!</p>\n    </div>\n    <script>\n      let currentScene = 0;\n      const scenes = document.querySelectorAll(".scene");\n\n      function nextScene() {\n        scenes[currentScene].classList.remove("active");\n        currentScene++;\n        if (currentScene < scenes.length) {\n          scenes[currentScene].classList.add("active");\n        }\n      }\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W3_M6_S3',
            xpReward: 50,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 4 — The Game Galaxy (Canvas API)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 4,
    name: 'The Game Galaxy',
    tagline: 'Create games with code and conquer the galaxy',
    narrative:
      'The Game Galaxy has lost its pixels! The arcade machines are dark and the high scores are gone. Rebuild the games, one pixel at a time!',
    language: 'html',
    color: '#D97706',
    icon: '🎮',
    badgeSlug: 'world-4',
    xpBonus: 500,
    missions: [
      // ── Mission 1: The Blank Canvas ────────────────────────────
      {
        id: 1,
        title: 'The Blank Canvas',
        questBrief:
          'Every game starts with a blank canvas — literally! Learn the HTML <canvas> element and how to draw rectangles with JavaScript.',
        estimatedMinutes: 15,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Create the Canvas',
            brief:
              'Add a <canvas> element and use getContext("2d") to get the drawing tool. Then draw a filled rectangle!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Blank Canvas</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      // 1. Get the canvas element\n      const canvas = document.getElementById("gameCanvas");\n\n      // 2. Get the 2D drawing context\n      // const ctx = canvas.getContext("2d");\n\n      // 3. Set a fill color with ctx.fillStyle = "#D97706"\n      // 4. Draw a rectangle with ctx.fillRect(x, y, width, height)\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M1_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Draw a Scene',
            brief:
              'Draw multiple rectangles to create a simple scene — a ground, a sky, and a house. Use different colors for each!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Blank Canvas</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      // Draw the sky (full canvas, light blue)\n      ctx.fillStyle = "#87CEEB";\n      ctx.fillRect(0, 0, 600, 400);\n\n      // Draw the ground (green rectangle at the bottom)\n\n      // Draw a house (brown rectangle for walls)\n\n      // Draw a roof (dark red rectangle on top of house)\n\n      // Draw a door (darker rectangle on the house)\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M1_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Clear & Redraw',
            brief:
              'Learn to clear the canvas with clearRect and redraw. Add a button that changes the scene from day to night!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Blank Canvas</title>\n    <style>\n      body { background: #FFFFFF; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; margin: 0; gap: 16px; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n      button { background: #D97706; color: #FFFFFF; border: none; padding: 12px 28px; border-radius: 10px; font-size: 16px; cursor: pointer; font-weight: bold; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <button id="toggleBtn">Switch to Night</button>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n      let isDay = true;\n\n      function drawScene() {\n        // Clear the entire canvas first\n        ctx.clearRect(0, 0, 600, 400);\n\n        // If isDay, use light blue sky; if night, use dark blue\n        if (isDay) {\n          ctx.fillStyle = "#87CEEB";\n        } else {\n          ctx.fillStyle = "#FFFFFF";\n        }\n        ctx.fillRect(0, 0, 600, 400);\n\n        // Draw ground, house (same for both)\n        ctx.fillStyle = "#228B22";\n        ctx.fillRect(0, 320, 600, 80);\n        ctx.fillStyle = "#8B4513";\n        ctx.fillRect(230, 220, 140, 100);\n\n        // If night, draw yellow window; if day, draw blue window\n        // Also draw stars at night (small white rectangles)\n      }\n\n      drawScene();\n\n      // When #toggleBtn is clicked: flip isDay, call drawScene(), update button text\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M1_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 2: The Drawing Chamber ─────────────────────────
      {
        id: 2,
        title: 'The Drawing Chamber',
        questBrief:
          'The Drawing Chamber holds more shapes! Learn to draw circles with arc(), add text with fillText(), and create complex scenes.',
        estimatedMinutes: 15,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Circles & Arcs',
            brief:
              'Use ctx.beginPath(), ctx.arc(), and ctx.fill() to draw circles. Create a smiley face with circles!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Drawing Chamber</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      // Draw a big yellow circle for the face\n      ctx.fillStyle = "#D97706";\n      ctx.beginPath();\n      ctx.arc(300, 200, 100, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle\n      ctx.fill();\n\n      // Draw two black circles for eyes\n      // Left eye at (270, 180), radius 12\n      // Right eye at (330, 180), radius 12\n\n      // Draw a smile using ctx.arc with a partial arc\n      // Use ctx.beginPath(), ctx.arc(), ctx.stroke()\n      // Center at (300, 210), radius 50, from 0.1*PI to 0.9*PI\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M2_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Text on Canvas',
            brief:
              'Use ctx.font and ctx.fillText() to write text on the canvas. Create a score display and a title screen for a game.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Drawing Chamber</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      // Background\n      ctx.fillStyle = "#FFFFFF";\n      ctx.fillRect(0, 0, 600, 400);\n\n      // Draw the game title in big yellow text\n      // Set ctx.font = "48px sans-serif"\n      // Set ctx.fillStyle = "#D97706"\n      // Use ctx.textAlign = "center" so text centers on the x position\n      // Use ctx.fillText("PIXEL ESCAPE", 300, 100)\n\n      // Draw "Press ENTER to Start" in smaller white text\n\n      // Draw a high score in the top-right corner\n      // ctx.textAlign = "right"\n      // ctx.font = "16px sans-serif"\n      // ctx.fillText("High Score: 1000", 580, 30)\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M2_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Shape Gallery',
            brief:
              'Combine everything — draw a space scene with a planet (circle), stars (small circles), a spaceship (rectangles), and a title.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Drawing Chamber</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      // Draw space background\n      ctx.fillStyle = "#FFFFFF";\n      ctx.fillRect(0, 0, 600, 400);\n\n      // Draw at least 10 stars (tiny white circles at random positions)\n      ctx.fillStyle = "#FFFFFF";\n      // Hint: use a for loop!\n      // for (let i = 0; i < 10; i++) {\n      //   ctx.beginPath();\n      //   ctx.arc(x, y, 2, 0, Math.PI * 2);\n      //   ctx.fill();\n      // }\n\n      // Draw a planet (large circle with a gradient or solid color)\n\n      // Draw a spaceship using rectangles (body, wings, window)\n\n      // Add a title: "The Game Galaxy"\n\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M2_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 3: The Animation Engine ────────────────────────
      {
        id: 3,
        title: 'The Animation Engine',
        questBrief:
          'Games need animation! Learn requestAnimationFrame and the game loop — the heartbeat that makes games run at 60 frames per second.',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'The Game Loop',
            brief:
              'Create a basic game loop with requestAnimationFrame that moves a square across the screen automatically.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Animation Engine</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      let x = 0;\n      let y = 180;\n      let speed = 2;\n\n      function gameLoop() {\n        // 1. Clear the canvas\n        ctx.clearRect(0, 0, 600, 400);\n\n        // 2. Draw background\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(0, 0, 600, 400);\n\n        // 3. Draw the moving square\n        ctx.fillStyle = "#D97706";\n        ctx.fillRect(x, y, 40, 40);\n\n        // 4. Update position\n        x += speed;\n\n        // 5. Wrap around when going off screen\n        if (x > 600) x = -40;\n\n        // 6. Request next frame\n        requestAnimationFrame(gameLoop);\n      }\n\n      // Start the loop!\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M3_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Bouncing Ball',
            brief:
              'Make a ball that bounces off the walls by reversing its direction when it hits an edge.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Animation Engine</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      let ballX = 300;\n      let ballY = 200;\n      let speedX = 3;\n      let speedY = 2;\n      let radius = 20;\n\n      function gameLoop() {\n        ctx.clearRect(0, 0, 600, 400);\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(0, 0, 600, 400);\n\n        // Draw the ball\n        ctx.fillStyle = "#D97706";\n        ctx.beginPath();\n        ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);\n        ctx.fill();\n\n        // Move the ball\n        ballX += speedX;\n        ballY += speedY;\n\n        // Bounce off walls:\n        // If ballX + radius > 600 or ballX - radius < 0, reverse speedX\n        // If ballY + radius > 400 or ballY - radius < 0, reverse speedY\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M3_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Particle Explosion',
            brief:
              'Create an array of particles that burst outward from the center, each with random speed and color. This is how real game effects work!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Animation Engine</title>\n    <style>\n      body { background: #FFFFFF; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; margin: 0; gap: 16px; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; cursor: pointer; }\n      p { color: #1E293B; font-family: sans-serif; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <p>Click the canvas to create an explosion!</p>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n      const colors = ["#D97706", "#DC2626", "#059669", "#0891B2", "#7C3AED"];\n\n      let particles = [];\n\n      // When the canvas is clicked, create 30 particles at the click position\n      // Each particle needs: x, y, speedX (random), speedY (random), color (random), radius, life\n      canvas.addEventListener("click", function(e) {\n        let rect = canvas.getBoundingClientRect();\n        let clickX = e.clientX - rect.left;\n        let clickY = e.clientY - rect.top;\n\n        for (let i = 0; i < 30; i++) {\n          particles.push({\n            x: clickX,\n            y: clickY,\n            speedX: (Math.random() - 0.5) * 8,\n            speedY: (Math.random() - 0.5) * 8,\n            color: colors[Math.floor(Math.random() * colors.length)],\n            radius: Math.random() * 5 + 2,\n            life: 1.0 // fades from 1.0 to 0\n          });\n        }\n      });\n\n      function gameLoop() {\n        ctx.clearRect(0, 0, 600, 400);\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(0, 0, 600, 400);\n\n        // Loop through particles, draw each one, update position, decrease life\n        // Remove particles when life reaches 0\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M3_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 4: The Control Room ────────────────────────────
      {
        id: 4,
        title: 'The Control Room',
        questBrief:
          'A game without controls is just a movie! Learn to handle keyboard input and let the player control what happens on screen.',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Arrow Key Movement',
            brief:
              'Listen for keydown events to move a player square with the arrow keys. Use an object to track which keys are currently pressed.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Control Room</title>\n    <style>\n      body { background: #FFFFFF; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; margin: 0; gap: 16px; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n      p { color: #1E293B; font-family: sans-serif; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <p>Use arrow keys to move the player!</p>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      let player = { x: 280, y: 180, size: 40, speed: 4 };\n\n      // Track which keys are pressed\n      let keys = {};\n\n      document.addEventListener("keydown", function(e) {\n        keys[e.key] = true;\n      });\n      document.addEventListener("keyup", function(e) {\n        keys[e.key] = false;\n      });\n\n      function gameLoop() {\n        ctx.clearRect(0, 0, 600, 400);\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(0, 0, 600, 400);\n\n        // Move player based on keys pressed\n        // if keys["ArrowUp"] -> decrease player.y\n        // if keys["ArrowDown"] -> increase player.y\n        // if keys["ArrowLeft"] -> decrease player.x\n        // if keys["ArrowRight"] -> increase player.x\n\n        // Keep player inside canvas bounds\n\n        // Draw player\n        ctx.fillStyle = "#D97706";\n        ctx.fillRect(player.x, player.y, player.size, player.size);\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M4_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Smooth Player',
            brief:
              'Make the player a circle, add a trail effect, and display coordinates on screen. Make the player feel responsive and smooth!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Control Room</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      let player = { x: 300, y: 200, radius: 20, speed: 4 };\n      let keys = {};\n\n      document.addEventListener("keydown", function(e) {\n        keys[e.key] = true;\n        e.preventDefault(); // Prevent scrolling\n      });\n      document.addEventListener("keyup", function(e) {\n        keys[e.key] = false;\n      });\n\n      function gameLoop() {\n        // Instead of clearing fully, draw a semi-transparent background\n        // This creates a trail effect!\n        ctx.fillStyle = "rgba(13, 21, 38, 0.3)";\n        ctx.fillRect(0, 0, 600, 400);\n\n        // Move player\n        if (keys["ArrowUp"]) player.y -= player.speed;\n        if (keys["ArrowDown"]) player.y += player.speed;\n        if (keys["ArrowLeft"]) player.x -= player.speed;\n        if (keys["ArrowRight"]) player.x += player.speed;\n\n        // Keep in bounds\n        // Hint: use Math.max and Math.min with player.radius\n\n        // Draw player as a circle\n        ctx.fillStyle = "#D97706";\n        ctx.beginPath();\n        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);\n        ctx.fill();\n\n        // Draw coordinates text\n        // ctx.fillStyle = "#1E293B"\n        // ctx.font = "14px monospace"\n        // ctx.fillText("X: " + Math.round(player.x) + " Y: " + Math.round(player.y), 10, 20)\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M4_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Collectible Coins',
            brief:
              'Add coins (circles) that appear at random positions. When the player moves over a coin, collect it and update the score!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Control Room</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      let player = { x: 300, y: 200, radius: 20, speed: 4 };\n      let score = 0;\n      let keys = {};\n      let coins = [];\n\n      // Create 5 coins at random positions\n      for (let i = 0; i < 5; i++) {\n        coins.push({\n          x: Math.random() * 560 + 20,\n          y: Math.random() * 360 + 20,\n          radius: 10\n        });\n      }\n\n      document.addEventListener("keydown", function(e) { keys[e.key] = true; e.preventDefault(); });\n      document.addEventListener("keyup", function(e) { keys[e.key] = false; });\n\n      function gameLoop() {\n        ctx.clearRect(0, 0, 600, 400);\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(0, 0, 600, 400);\n\n        // Move player\n        if (keys["ArrowUp"]) player.y -= player.speed;\n        if (keys["ArrowDown"]) player.y += player.speed;\n        if (keys["ArrowLeft"]) player.x -= player.speed;\n        if (keys["ArrowRight"]) player.x += player.speed;\n\n        // Draw and check coins\n        // For each coin, check distance to player:\n        //   distance = Math.sqrt((player.x - coin.x)**2 + (player.y - coin.y)**2)\n        //   if distance < player.radius + coin.radius -> collected!\n        //   Remove the coin and add to score\n        //   Spawn a new coin at a random position\n\n        // Draw coins (yellow circles)\n\n        // Draw player (yellow circle)\n        ctx.fillStyle = "#D97706";\n        ctx.beginPath();\n        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);\n        ctx.fill();\n\n        // Draw score\n        ctx.fillStyle = "#1E293B";\n        ctx.font = "20px sans-serif";\n        ctx.fillText("Coins: " + score, 20, 30);\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M4_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 5: The Collision Core ──────────────────────────
      {
        id: 5,
        title: 'The Collision Core',
        questBrief:
          'When objects collide, things happen! Learn to detect when two objects overlap — the key to making real games.',
        estimatedMinutes: 25,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Box Collision',
            brief:
              'Learn rectangle (AABB) collision detection. Make a box change color when it overlaps with the player box.',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Collision Core</title>\n    <style>\n      body { background: #FFFFFF; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; margin: 0; gap: 16px; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n      p { color: #1E293B; font-family: sans-serif; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <p id="status">No collision</p>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      let player = { x: 50, y: 180, width: 40, height: 40, speed: 4 };\n      let box = { x: 280, y: 180, width: 60, height: 60 };\n      let keys = {};\n\n      document.addEventListener("keydown", function(e) { keys[e.key] = true; e.preventDefault(); });\n      document.addEventListener("keyup", function(e) { keys[e.key] = false; });\n\n      // Write a function that checks if two rectangles overlap\n      // Two boxes collide when:\n      // box1.x < box2.x + box2.width &&\n      // box1.x + box1.width > box2.x &&\n      // box1.y < box2.y + box2.height &&\n      // box1.y + box1.height > box2.y\n      function checkCollision(a, b) {\n        // Return true if they overlap, false otherwise\n      }\n\n      function gameLoop() {\n        ctx.clearRect(0, 0, 600, 400);\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(0, 0, 600, 400);\n\n        if (keys["ArrowUp"]) player.y -= player.speed;\n        if (keys["ArrowDown"]) player.y += player.speed;\n        if (keys["ArrowLeft"]) player.x -= player.speed;\n        if (keys["ArrowRight"]) player.x += player.speed;\n\n        let hit = checkCollision(player, box);\n\n        // Draw the box — green if colliding, red if not\n        ctx.fillStyle = hit ? "#059669" : "#DC2626";\n        ctx.fillRect(box.x, box.y, box.width, box.height);\n\n        // Draw player\n        ctx.fillStyle = "#D97706";\n        ctx.fillRect(player.x, player.y, player.width, player.height);\n\n        document.getElementById("status").textContent = hit ? "COLLISION!" : "No collision";\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M5_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Dodge the Obstacles',
            brief:
              'Obstacles fall from the top of the screen. The player moves left and right to dodge them. If hit, the game ends!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Collision Core</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      let player = { x: 280, y: 350, width: 40, height: 40, speed: 5 };\n      let obstacles = [];\n      let score = 0;\n      let gameOver = false;\n      let keys = {};\n      let frameCount = 0;\n\n      document.addEventListener("keydown", function(e) { keys[e.key] = true; e.preventDefault(); });\n      document.addEventListener("keyup", function(e) { keys[e.key] = false; });\n\n      function checkCollision(a, b) {\n        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;\n      }\n\n      function gameLoop() {\n        if (gameOver) {\n          ctx.fillStyle = "#DC2626";\n          ctx.font = "48px sans-serif";\n          ctx.textAlign = "center";\n          ctx.fillText("GAME OVER", 300, 200);\n          ctx.font = "24px sans-serif";\n          ctx.fillText("Score: " + score, 300, 250);\n          return;\n        }\n\n        ctx.clearRect(0, 0, 600, 400);\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(0, 0, 600, 400);\n\n        // Move player left/right\n        if (keys["ArrowLeft"]) player.x -= player.speed;\n        if (keys["ArrowRight"]) player.x += player.speed;\n        player.x = Math.max(0, Math.min(560, player.x));\n\n        // Spawn obstacles every 40 frames\n        frameCount++;\n        if (frameCount % 40 === 0) {\n          obstacles.push({\n            x: Math.random() * 560,\n            y: -30,\n            width: 30 + Math.random() * 30,\n            height: 30,\n            speed: 2 + Math.random() * 3\n          });\n        }\n\n        // Update and draw obstacles\n        // Move each obstacle down, check collision with player\n        // Remove obstacles that go off screen\n        // Increase score for each dodged obstacle\n\n        // Draw player\n        ctx.fillStyle = "#D97706";\n        ctx.fillRect(player.x, player.y, player.width, player.height);\n\n        // Draw score\n        ctx.fillStyle = "#1E293B";\n        ctx.font = "20px sans-serif";\n        ctx.textAlign = "left";\n        ctx.fillText("Score: " + score, 20, 30);\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M5_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Power-Ups',
            brief:
              'Add special power-up items that fall alongside obstacles. Collecting them gives the player a shield (invincibility) for 3 seconds!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>The Collision Core</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      let player = { x: 280, y: 350, width: 40, height: 40, speed: 5 };\n      let obstacles = [];\n      let powerUps = [];\n      let score = 0;\n      let gameOver = false;\n      let shielded = false;\n      let shieldTimer = 0;\n      let keys = {};\n      let frameCount = 0;\n\n      document.addEventListener("keydown", function(e) { keys[e.key] = true; e.preventDefault(); });\n      document.addEventListener("keyup", function(e) { keys[e.key] = false; });\n\n      function checkCollision(a, b) {\n        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;\n      }\n\n      function gameLoop() {\n        if (gameOver) {\n          ctx.fillStyle = "#DC2626";\n          ctx.font = "48px sans-serif";\n          ctx.textAlign = "center";\n          ctx.fillText("GAME OVER", 300, 200);\n          ctx.font = "24px sans-serif";\n          ctx.fillText("Score: " + score, 300, 250);\n          ctx.fillStyle = "#059669";\n          ctx.fillText("Press R to Restart", 300, 300);\n          return;\n        }\n\n        ctx.clearRect(0, 0, 600, 400);\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(0, 0, 600, 400);\n\n        if (keys["ArrowLeft"]) player.x -= player.speed;\n        if (keys["ArrowRight"]) player.x += player.speed;\n        player.x = Math.max(0, Math.min(560, player.x));\n\n        frameCount++;\n        // Spawn obstacles\n        if (frameCount % 40 === 0) {\n          obstacles.push({ x: Math.random() * 560, y: -30, width: 30 + Math.random() * 30, height: 30, speed: 2 + Math.random() * 3 });\n        }\n        // Spawn power-ups less frequently (every 200 frames)\n        // Power-ups are green circles that give shields\n\n        // Update shield timer\n        // If shielded and timer expires, remove shield\n\n        // Update obstacles, check collisions\n        // If shielded, player survives hits!\n\n        // Update and check power-ups\n        // If player collects a power-up, activate shield for 180 frames (3 seconds)\n\n        // Draw player (with glow effect when shielded)\n        if (shielded) {\n          ctx.fillStyle = "rgba(0, 229, 255, 0.3)";\n          ctx.beginPath();\n          ctx.arc(player.x + 20, player.y + 20, 35, 0, Math.PI * 2);\n          ctx.fill();\n        }\n        ctx.fillStyle = shielded ? "#0891B2" : "#D97706";\n        ctx.fillRect(player.x, player.y, player.width, player.height);\n\n        // Draw HUD\n        ctx.fillStyle = "#1E293B";\n        ctx.font = "20px sans-serif";\n        ctx.textAlign = "left";\n        ctx.fillText("Score: " + score, 20, 30);\n        if (shielded) {\n          ctx.fillStyle = "#0891B2";\n          ctx.fillText("SHIELD ACTIVE", 20, 55);\n        }\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M5_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 6 (Boss): Pixel Escape ─────────────────────────
      {
        id: 6,
        title: 'Pixel Escape',
        questBrief:
          'The ultimate Game Galaxy challenge! Build a complete side-scrolling game with a running player, scrolling obstacles, scoring, and a game-over screen.',
        estimatedMinutes: 30,
        xpReward: 200,
        badgeSlug: 'world-4',
        stages: [
          {
            id: 1,
            title: 'The Runner',
            brief:
              'Create a side-scroller where the background scrolls left and the player can jump using the spacebar. Implement gravity!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Pixel Escape</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      const GROUND_Y = 320;\n      const GRAVITY = 0.5;\n\n      let player = {\n        x: 80,\n        y: GROUND_Y,\n        width: 40,\n        height: 40,\n        velocityY: 0,\n        isJumping: false\n      };\n\n      // Scrolling ground\n      let groundOffset = 0;\n      let speed = 3;\n\n      document.addEventListener("keydown", function(e) {\n        // When spacebar is pressed and player is NOT jumping:\n        // Set velocityY to -12 (jump force)\n        // Set isJumping to true\n        if (e.key === " " && !player.isJumping) {\n          player.velocityY = -12;\n          player.isJumping = true;\n        }\n        e.preventDefault();\n      });\n\n      function gameLoop() {\n        ctx.clearRect(0, 0, 600, 400);\n\n        // Sky\n        ctx.fillStyle = "#1a0a2e";\n        ctx.fillRect(0, 0, 600, GROUND_Y);\n\n        // Ground\n        ctx.fillStyle = "#2d5a27";\n        ctx.fillRect(0, GROUND_Y, 600, 80);\n\n        // Apply gravity to player\n        player.velocityY += GRAVITY;\n        player.y += player.velocityY;\n\n        // Stop at ground\n        if (player.y >= GROUND_Y) {\n          player.y = GROUND_Y;\n          player.velocityY = 0;\n          player.isJumping = false;\n        }\n\n        // Draw player\n        ctx.fillStyle = "#D97706";\n        ctx.fillRect(player.x, player.y - player.height, player.width, player.height);\n\n        // Scroll ground lines for movement effect\n        // Draw dashed lines on the ground that scroll left\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M6_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Obstacles & Scoring',
            brief:
              'Add scrolling obstacles that the player must jump over. Each dodged obstacle adds to the score. Speed increases over time!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Pixel Escape</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      const GROUND_Y = 320;\n      const GRAVITY = 0.5;\n\n      let player = { x: 80, y: GROUND_Y, width: 40, height: 40, velocityY: 0, isJumping: false };\n      let obstacles = [];\n      let score = 0;\n      let speed = 3;\n      let frameCount = 0;\n      let gameOver = false;\n\n      document.addEventListener("keydown", function(e) {\n        if (e.key === " " && !player.isJumping && !gameOver) {\n          player.velocityY = -12;\n          player.isJumping = true;\n        }\n        e.preventDefault();\n      });\n\n      function checkCollision(a, b) {\n        return a.x < b.x + b.width && a.x + a.width > b.x && a.y - a.height < b.y && a.y > b.y - b.height;\n      }\n\n      function gameLoop() {\n        if (gameOver) {\n          ctx.fillStyle = "rgba(0,0,0,0.7)";\n          ctx.fillRect(0, 0, 600, 400);\n          ctx.fillStyle = "#DC2626";\n          ctx.font = "48px sans-serif";\n          ctx.textAlign = "center";\n          ctx.fillText("GAME OVER", 300, 180);\n          ctx.fillStyle = "#D97706";\n          ctx.font = "28px sans-serif";\n          ctx.fillText("Score: " + score, 300, 230);\n          ctx.fillStyle = "#1E293B";\n          ctx.font = "18px sans-serif";\n          ctx.fillText("Press SPACE to restart", 300, 280);\n          return;\n        }\n\n        ctx.clearRect(0, 0, 600, 400);\n        ctx.fillStyle = "#1a0a2e";\n        ctx.fillRect(0, 0, 600, GROUND_Y);\n        ctx.fillStyle = "#2d5a27";\n        ctx.fillRect(0, GROUND_Y, 600, 80);\n\n        // Gravity\n        player.velocityY += GRAVITY;\n        player.y += player.velocityY;\n        if (player.y >= GROUND_Y) { player.y = GROUND_Y; player.velocityY = 0; player.isJumping = false; }\n\n        // Spawn obstacles\n        frameCount++;\n        // Every 80-120 frames, add a new obstacle on the right side\n        // Increase speed slightly over time (speed += 0.001 per frame)\n\n        // Move obstacles left, check collision, remove off-screen ones\n        // If obstacle passes player, increment score\n\n        // Draw obstacles (red rectangles)\n\n        // Draw player\n        ctx.fillStyle = "#D97706";\n        ctx.fillRect(player.x, player.y - player.height, player.width, player.height);\n\n        // Draw score\n        ctx.fillStyle = "#1E293B";\n        ctx.font = "20px sans-serif";\n        ctx.textAlign = "left";\n        ctx.fillText("Score: " + score, 20, 30);\n        ctx.fillText("Speed: " + speed.toFixed(1), 20, 55);\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M6_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Polish & Effects',
            brief:
              'Add a start screen, particle effects when jumping, a high score tracker, and visual polish. Your game is complete!',
            starterCode: {
              html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Pixel Escape</title>\n    <style>\n      body { background: #FFFFFF; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n      canvas { border: 2px solid #D97706; border-radius: 8px; }\n    </style>\n  </head>\n  <body>\n    <canvas id="gameCanvas" width="600" height="400"></canvas>\n    <script>\n      const canvas = document.getElementById("gameCanvas");\n      const ctx = canvas.getContext("2d");\n\n      const GROUND_Y = 320;\n      const GRAVITY = 0.5;\n\n      let player = { x: 80, y: GROUND_Y, width: 40, height: 40, velocityY: 0, isJumping: false };\n      let obstacles = [];\n      let particles = [];\n      let score = 0;\n      let highScore = 0;\n      let speed = 3;\n      let frameCount = 0;\n      let gameState = "start"; // "start", "playing", "gameover"\n\n      document.addEventListener("keydown", function(e) {\n        if (e.key === " ") {\n          if (gameState === "start") {\n            gameState = "playing";\n          } else if (gameState === "playing" && !player.isJumping) {\n            player.velocityY = -12;\n            player.isJumping = true;\n            // Spawn jump particles!\n            // Add 10 small particles at player feet position\n          } else if (gameState === "gameover") {\n            // Reset everything and go back to playing\n          }\n          e.preventDefault();\n        }\n      });\n\n      function checkCollision(a, b) {\n        return a.x < b.x + b.width && a.x + a.width > b.x && a.y - a.height < b.y && a.y > b.y - b.height;\n      }\n\n      function drawStartScreen() {\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(0, 0, 600, 400);\n        ctx.textAlign = "center";\n        ctx.fillStyle = "#D97706";\n        ctx.font = "bold 52px sans-serif";\n        ctx.fillText("PIXEL ESCAPE", 300, 150);\n        ctx.fillStyle = "#1E293B";\n        ctx.font = "20px sans-serif";\n        ctx.fillText("Press SPACE to start", 300, 220);\n        ctx.fillStyle = "#888";\n        ctx.font = "16px sans-serif";\n        ctx.fillText("High Score: " + highScore, 300, 280);\n        // Add a pulsing effect to "Press SPACE" text\n      }\n\n      function gameLoop() {\n        if (gameState === "start") {\n          drawStartScreen();\n          requestAnimationFrame(gameLoop);\n          return;\n        }\n\n        if (gameState === "gameover") {\n          // Draw game over screen with score and high score\n          // Update high score if current score is higher\n          requestAnimationFrame(gameLoop);\n          return;\n        }\n\n        // --- PLAYING STATE ---\n        ctx.clearRect(0, 0, 600, 400);\n        ctx.fillStyle = "#1a0a2e";\n        ctx.fillRect(0, 0, 600, GROUND_Y);\n        ctx.fillStyle = "#2d5a27";\n        ctx.fillRect(0, GROUND_Y, 600, 80);\n\n        // Draw scrolling stars in the sky for parallax effect\n\n        // Physics\n        player.velocityY += GRAVITY;\n        player.y += player.velocityY;\n        if (player.y >= GROUND_Y) { player.y = GROUND_Y; player.velocityY = 0; player.isJumping = false; }\n\n        // Obstacles\n        frameCount++;\n        speed += 0.001;\n        if (frameCount % Math.max(40, Math.floor(90 - speed * 5)) === 0) {\n          obstacles.push({ x: 620, y: GROUND_Y, width: 20 + Math.random() * 20, height: 30 + Math.random() * 30, speed: speed });\n        }\n\n        // Update obstacles\n        for (let i = obstacles.length - 1; i >= 0; i--) {\n          obstacles[i].x -= obstacles[i].speed;\n          if (obstacles[i].x + obstacles[i].width < 0) { obstacles.splice(i, 1); score++; continue; }\n          if (checkCollision(player, obstacles[i])) { gameState = "gameover"; }\n          ctx.fillStyle = "#DC2626";\n          ctx.fillRect(obstacles[i].x, obstacles[i].y - obstacles[i].height, obstacles[i].width, obstacles[i].height);\n        }\n\n        // Update and draw particles\n        // Particles shrink and fade over time\n\n        // Draw player\n        ctx.fillStyle = "#D97706";\n        ctx.fillRect(player.x, player.y - player.height, player.width, player.height);\n        // Draw eyes on player\n        ctx.fillStyle = "#FFFFFF";\n        ctx.fillRect(player.x + 24, player.y - player.height + 10, 8, 8);\n\n        // HUD\n        ctx.fillStyle = "#1E293B";\n        ctx.font = "20px sans-serif";\n        ctx.textAlign = "left";\n        ctx.fillText("Score: " + score, 20, 30);\n\n        requestAnimationFrame(gameLoop);\n      }\n\n      gameLoop();\n    </script>\n  </body>\n</html>',
              css: '',
              js: '',
            },
            validationFn: 'validate_W4_M6_S3',
            xpReward: 50,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // WORLD 5 — Python Planet (Python via Pyodide)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 5,
    name: 'Python Planet',
    tagline: 'Discover the language of data and automation',
    narrative:
      'Python Planet has lost its scripts! Robots stand idle, data is unsorted, and the text portals are closed. Write Python to bring it all back online!',
    language: 'python',
    color: '#DC2626',
    icon: '🐍',
    badgeSlug: 'world-5',
    xpBonus: 500,
    missions: [
      // ── Mission 1: The First Words ─────────────────────────────
      {
        id: 1,
        title: 'The First Words',
        questBrief:
          'Every programmer starts with "Hello, World!" Learn to speak Python with print(), create variables, and understand types.',
        estimatedMinutes: 15,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Hello, World!',
            brief:
              'Use the print() function to display "Hello, World!" on the screen. This is the very first thing every programmer learns!',
            starterCode: {
              python:
                '# Your first Python program!\n# Use print() to display a message\n# Example: print("Hello")\n\n# Write your code below\n',
            },
            validationFn: 'validate_W5_M1_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Variables & Types',
            brief:
              'Create variables to store your name (string), your age (number), and whether you like coding (boolean). Print them all!',
            starterCode: {
              python:
                '# Create three variables:\n# name - a string with your name\n# age - a number with your age\n# loves_coding - True or False\n\n# Write your code below\n\n\n# Print each one using print()\n# Example: print("My name is", name)\n',
            },
            validationFn: 'validate_W5_M1_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'String Magic',
            brief:
              'Learn to combine strings with + and use f-strings. Create a greeting message that includes your name and age.',
            starterCode: {
              python:
                '# String concatenation and f-strings\n\nname = "Spark Coder"\nage = 12\n\n# Method 1: Concatenation with +\n# greeting = "Hello, my name is " + name\n# print(greeting)\n\n# Method 2: f-strings (the cool way!)\n# message = f"I am {name} and I am {age} years old"\n# print(message)\n\n# Write your code below:\n# Create a variable called intro that uses an f-string\n# to say "Hi! I\'m [name] and I\'m [age] years old. Let\'s code!"\n# Then print it\n',
            },
            validationFn: 'validate_W5_M1_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 2: The Decision Engine ─────────────────────────
      {
        id: 2,
        title: 'The Decision Engine',
        questBrief:
          'The Decision Engine makes choices based on data. Learn input(), if/elif/else, and comparison operators to control the flow!',
        estimatedMinutes: 15,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'If/Else Basics',
            brief:
              'Write an if/else statement that checks if a number is even or odd and prints the result.',
            starterCode: {
              python:
                '# Check if a number is even or odd\n# Even numbers are divisible by 2 (number % 2 == 0)\n\nnumber = 7\n\n# Write an if/else statement:\n# If number is even, print "[number] is even!"\n# Otherwise, print "[number] is odd!"\n\n# Write your code below\n',
            },
            validationFn: 'validate_W5_M2_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Multiple Choices',
            brief:
              'Use if/elif/else to build a temperature checker: "freezing" (below 0), "cold" (0-15), "nice" (16-25), or "hot" (above 25).',
            starterCode: {
              python:
                '# Temperature Checker\n\ntemperature = 18\n\n# Write if/elif/else to classify the temperature:\n# Below 0: "Freezing! Stay inside!"\n# 0 to 15: "Cold - wear a jacket!"\n# 16 to 25: "Nice weather!"\n# Above 25: "Hot! Get some water!"\n\n# Write your code below\n\n\n# Print the result like: "18 degrees: Nice weather!"\n',
            },
            validationFn: 'validate_W5_M2_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'User Input',
            brief:
              'Use input() to ask the user for their favorite color, then respond differently based on what they type.',
            starterCode: {
              python:
                '# Interactive color program!\n\n# Ask the user for their favorite color\n# color = input("What is your favorite color? ")\n\n# Use if/elif/else to respond:\n# "red" -> "Red like a dragon! Fierce!"\n# "blue" -> "Blue like the ocean! Calm!"\n# "green" -> "Green like the forest! Natural!"\n# anything else -> "[color] is a cool choice!"\n\n# Write your code below\n# Note: use .lower() on the input to handle any capitalization\n# Example: color = input("...").lower()\n',
            },
            validationFn: 'validate_W5_M2_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 3: The List Archives ───────────────────────────
      {
        id: 3,
        title: 'The List Archives',
        questBrief:
          'The List Archives store collections of data. Learn to create lists, loop through them, and use powerful list methods!',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Creating Lists',
            brief:
              'Create a list of your favorite foods, add a new one with .append(), and print the list and its length.',
            starterCode: {
              python:
                '# Create a list of your favorite foods\n# Example: foods = ["pizza", "tacos", "ice cream"]\n\n# Write your code below\n\n\n# Print the list\n# print(foods)\n\n# Print how many items: print(f"I have {len(foods)} favorite foods!")\n\n# Add a new food using .append()\n# foods.append("sushi")\n\n# Print the updated list\n',
            },
            validationFn: 'validate_W5_M3_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Looping Through Lists',
            brief:
              'Use a for loop to go through each item in a list and print it with its position number.',
            starterCode: {
              python:
                '# Loop through a list of heroes\nheroes = ["Ada Lovelace", "Alan Turing", "Grace Hopper", "Tim Berners-Lee", "Guido van Rossum"]\n\n# Method 1: Simple for loop\n# for hero in heroes:\n#     print(hero)\n\n# Method 2: Loop with index using enumerate()\n# for index, hero in enumerate(heroes):\n#     print(f"{index + 1}. {hero}")\n\n# Write your code below:\n# Use enumerate() to print each hero with their number\n# Then print the total count\n',
            },
            validationFn: 'validate_W5_M3_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'List Powers',
            brief:
              'Use list methods and a for loop to build a number analyzer: find the sum, average, max, and min of a list of numbers.',
            starterCode: {
              python:
                '# Number Analyzer\n\nnumbers = [42, 17, 93, 8, 55, 31, 76, 24, 68, 12]\n\n# 1. Print the list\nprint("Numbers:", numbers)\n\n# 2. Find and print the total (use sum())\n\n# 3. Find and print the average (sum / length)\n\n# 4. Find and print the biggest number (use max())\n\n# 5. Find and print the smallest number (use min())\n\n# 6. Sort the list and print it (use sorted())\n\n# 7. BONUS: Use a for loop to find all numbers greater than 50\n# and add them to a new list called "big_numbers"\n',
            },
            validationFn: 'validate_W5_M3_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 4: The Function Forge ──────────────────────────
      {
        id: 4,
        title: 'The Function Forge',
        questBrief:
          'The Function Forge is where reusable tools are crafted. Learn def, parameters, return values, and build your own toolkit!',
        estimatedMinutes: 20,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Your First Function',
            brief:
              'Define a function called greet that takes a name and returns a greeting message. Then call it with different names!',
            starterCode: {
              python:
                '# Create your first function!\n\n# Define a function called greet\n# It takes one parameter: name\n# It returns f"Hello, {name}! Welcome to Python Planet!"\n\n# Write your code below\n\n\n# Call the function with different names and print the results\n# print(greet("Alex"))\n# print(greet("Jordan"))\n# print(greet("Sam"))\n',
            },
            validationFn: 'validate_W5_M4_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Functions with Logic',
            brief:
              'Create a function called check_password that takes a password string and returns whether it is strong (8+ characters, has a number).',
            starterCode: {
              python:
                '# Password Strength Checker\n\n# Create a function called check_password\n# It takes one parameter: password\n# It checks:\n#   - Is it at least 8 characters long? (use len())\n#   - Does it contain at least one number? (use any(c.isdigit() for c in password))\n# Returns "Strong password!" if BOTH are true\n# Returns "Too short!" if less than 8 characters\n# Returns "Needs a number!" if no digits\n\n# Write your code below\n\n\n# Test it with these passwords:\ntest_passwords = ["hello", "abcdefgh", "abc123", "supersecure99"]\n\nfor pw in test_passwords:\n    result = check_password(pw)\n    print(f"  {pw} -> {result}")\n',
            },
            validationFn: 'validate_W5_M4_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Building a Toolkit',
            brief:
              'Create multiple functions that work together: a calculator toolkit with add, subtract, multiply, and a function that processes a list of operations.',
            starterCode: {
              python:
                '# Calculator Toolkit\n\n# Create these functions:\n# 1. add(a, b) - returns a + b\n# 2. subtract(a, b) - returns a - b\n# 3. multiply(a, b) - returns a * b\n# 4. divide(a, b) - returns a / b (but handle division by zero!)\n\n# Write your code below\n\n\n# 5. Create a function called calculate(operation, a, b)\n# It takes a string operation ("add", "subtract", "multiply", "divide")\n# and two numbers, then calls the right function\n\n\n# Test your toolkit:\nprint("5 + 3 =", calculate("add", 5, 3))\nprint("10 - 4 =", calculate("subtract", 10, 4))\nprint("6 * 7 =", calculate("multiply", 6, 7))\nprint("15 / 3 =", calculate("divide", 15, 3))\nprint("10 / 0 =", calculate("divide", 10, 0))\n',
            },
            validationFn: 'validate_W5_M4_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 5: The Data Vault ──────────────────────────────
      {
        id: 5,
        title: 'The Data Vault',
        questBrief:
          'The Data Vault stores structured information. Learn dictionaries — Python\'s way of storing data with names (keys) and values!',
        estimatedMinutes: 25,
        xpReward: 150,
        stages: [
          {
            id: 1,
            title: 'Your First Dictionary',
            brief:
              'Create a dictionary to store information about yourself: name, age, favorite color, and hobbies. Access and print each value.',
            starterCode: {
              python:
                '# Create a dictionary about yourself\n# Dictionaries use key: value pairs inside {}\n\n# Example:\n# person = {\n#     "name": "Spark",\n#     "age": 12,\n#     "color": "purple",\n#     "hobbies": ["coding", "gaming", "reading"]\n# }\n\n# Write your code below - create your own person dictionary\n\n\n# Access values using the key:\n# print(person["name"])\n# print(f\'{person["name"]} is {person["age"]} years old\')\n\n# Print all hobbies using a loop:\n# for hobby in person["hobbies"]:\n#     print(f"  - {hobby}")\n',
            },
            validationFn: 'validate_W5_M5_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Dictionary of Heroes',
            brief:
              'Create a list of dictionaries (a database!) for game characters. Loop through and display each character\'s stats.',
            starterCode: {
              python:
                '# Character Database\n# A list of dictionaries - each dictionary is one character\n\ncharacters = [\n    {"name": "Luna", "class": "Wizard", "health": 80, "power": 95},\n    {"name": "Rex", "class": "Warrior", "health": 120, "power": 70},\n    # Add at least 2 more characters!\n]\n\n# Write your code below\n\n\n# Loop through and display each character:\n# Use a formatted string like:\n# "[name] the [class] - HP: [health], Power: [power]"\n\nprint("=== Hero Roster ===")\nfor character in characters:\n    # Print each character\'s info\n    pass\n\n# BONUS: Find and print the character with the highest power\n# Hint: use max() with a key function\n',
            },
            validationFn: 'validate_W5_M5_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'Inventory System',
            brief:
              'Build an inventory system using a dictionary. Create functions to add items, remove items, and display the inventory.',
            starterCode: {
              python:
                '# Inventory System\n# The inventory is a dictionary where keys are item names\n# and values are quantities\n\ninventory = {}\n\ndef add_item(name, quantity=1):\n    """Add an item to the inventory."""\n    # If the item already exists, increase the quantity\n    # Otherwise, add it as a new entry\n    # Write your code below\n    pass\n\ndef remove_item(name, quantity=1):\n    """Remove an item from the inventory."""\n    # If the item exists and quantity > 0, decrease it\n    # If quantity reaches 0, remove the item entirely\n    # If item doesn\'t exist, print "[name] not in inventory!"\n    # Write your code below\n    pass\n\ndef show_inventory():\n    """Display all items in the inventory."""\n    if not inventory:\n        print("Inventory is empty!")\n        return\n    print("\\n=== Inventory ===")\n    for item, qty in inventory.items():\n        print(f"  {item}: {qty}")\n    print(f"Total items: {sum(inventory.values())}")\n    print("=================")\n\n# Test your inventory system:\nadd_item("sword")\nadd_item("health potion", 3)\nadd_item("shield")\nadd_item("health potion", 2)\nshow_inventory()\n\nremove_item("health potion")\nshow_inventory()\n\nremove_item("magic wand")  # Should print not in inventory\n',
            },
            validationFn: 'validate_W5_M5_S3',
            xpReward: 50,
          },
        ],
      },

      // ── Mission 6 (Boss): The Text Portal ─────────────────────
      {
        id: 6,
        title: 'The Text Portal',
        questBrief:
          'The ultimate Python challenge! Build a text adventure game with rooms, items, and choices. Combine everything you have learned!',
        estimatedMinutes: 30,
        xpReward: 200,
        badgeSlug: 'world-5',
        stages: [
          {
            id: 1,
            title: 'World Building',
            brief:
              'Define the game world as a dictionary of rooms. Each room has a description, available exits, and optional items.',
            starterCode: {
              python:
                '# Text Adventure - World Building\n\n# Define your game world as a dictionary of rooms\n# Each room has: description, exits (dict of direction -> room_name), and items (list)\n\nrooms = {\n    "entrance": {\n        "description": "You stand at the entrance of a mysterious cave. Torches flicker on the walls.",\n        "exits": {"north": "hallway"},\n        "items": ["torch"]\n    },\n    "hallway": {\n        "description": "A long dark hallway stretches before you. Doors lead in several directions.",\n        "exits": {"south": "entrance", "east": "treasure_room", "west": "monster_den"},\n        "items": []\n    },\n    # Add at least 2 more rooms!\n    # "treasure_room": { ... }\n    # "monster_den": { ... }\n}\n\n# Write your code below\n\n\n# Create a function to display a room:\ndef show_room(room_name):\n    room = rooms[room_name]\n    print(f"\\n--- {room_name.replace(\'_\', \' \').title()} ---")\n    print(room["description"])\n    if room["items"]:\n        print(f"You see: {\', \'.join(room[\'items\'])}")\n    print(f"Exits: {\', \'.join(room[\'exits\'].keys())}")\n\n# Test it:\nshow_room("entrance")\nshow_room("hallway")\n',
            },
            validationFn: 'validate_W5_M6_S1',
            xpReward: 50,
          },
          {
            id: 2,
            title: 'Player & Commands',
            brief:
              'Create a player with an inventory and position. Parse commands like "go north", "take torch", and "inventory".',
            starterCode: {
              python:
                '# Text Adventure - Player & Commands\n\nrooms = {\n    "entrance": {\n        "description": "You stand at the entrance of a mysterious cave.",\n        "exits": {"north": "hallway"},\n        "items": ["torch"]\n    },\n    "hallway": {\n        "description": "A long dark hallway. Doors lead in several directions.",\n        "exits": {"south": "entrance", "east": "treasure_room", "west": "monster_den"},\n        "items": ["key"]\n    },\n    "treasure_room": {\n        "description": "A glittering room full of gold coins!",\n        "exits": {"west": "hallway"},\n        "items": ["gold_coin", "diamond"]\n    },\n    "monster_den": {\n        "description": "A dark den. You hear growling...",\n        "exits": {"east": "hallway"},\n        "items": ["shield"]\n    }\n}\n\n# Player state\nplayer = {\n    "location": "entrance",\n    "inventory": []\n}\n\ndef show_room():\n    room = rooms[player["location"]]\n    name = player["location"].replace("_", " ").title()\n    print(f"\\n--- {name} ---")\n    print(room["description"])\n    if room["items"]:\n        print(f"Items here: {\', \'.join(room[\'items\'])}")\n    print(f"Exits: {\', \'.join(room[\'exits\'].keys())}")\n\ndef process_command(command):\n    """Parse and execute a player command."""\n    parts = command.lower().split()\n    if not parts:\n        print("Type a command!")\n        return\n\n    action = parts[0]\n\n    if action == "go" and len(parts) > 1:\n        direction = parts[1]\n        # Check if direction is a valid exit, move player there\n        # Write your code below\n        pass\n\n    elif action == "take" and len(parts) > 1:\n        item = parts[1]\n        # Check if item is in current room, add to inventory\n        # Write your code below\n        pass\n\n    elif action == "inventory":\n        # Show player inventory\n        # Write your code below\n        pass\n\n    elif action == "look":\n        show_room()\n\n    else:\n        print("I don\'t understand that command.")\n        print("Try: go [direction], take [item], inventory, look")\n\n# Test the commands:\nshow_room()\nprocess_command("take torch")\nprocess_command("inventory")\nprocess_command("go north")\nprocess_command("look")\n',
            },
            validationFn: 'validate_W5_M6_S2',
            xpReward: 50,
          },
          {
            id: 3,
            title: 'The Game Loop',
            brief:
              'Put it all together with a game loop! The game runs until the player wins (collects all treasure) or types "quit". Add a win condition!',
            starterCode: {
              python:
                '# Text Adventure - The Complete Game!\n\nrooms = {\n    "entrance": {\n        "description": "You stand at the entrance of a mysterious cave. Torches flicker on the walls.",\n        "exits": {"north": "hallway"},\n        "items": ["torch"]\n    },\n    "hallway": {\n        "description": "A long dark hallway. Doors lead in several directions.",\n        "exits": {"south": "entrance", "east": "treasure_room", "west": "monster_den", "north": "boss_room"},\n        "items": ["key"]\n    },\n    "treasure_room": {\n        "description": "A glittering room full of gold coins!",\n        "exits": {"west": "hallway"},\n        "items": ["gold_coin", "diamond"]\n    },\n    "monster_den": {\n        "description": "A dark den. You hear growling... but it is friendly!",\n        "exits": {"east": "hallway"},\n        "items": ["magic_sword"]\n    },\n    "boss_room": {\n        "description": "The final chamber! A locked chest sits in the center.",\n        "exits": {"south": "hallway"},\n        "items": ["treasure_chest"]\n    }\n}\n\nplayer = {"location": "entrance", "inventory": [], "moves": 0}\n\ndef show_room():\n    room = rooms[player["location"]]\n    name = player["location"].replace("_", " ").title()\n    print(f"\\n--- {name} ---")\n    print(room["description"])\n    if room["items"]:\n        print(f"Items here: {\', \'.join(room[\'items\'])}")\n    print(f"Exits: {\', \'.join(room[\'exits\'].keys())}")\n\ndef process_command(command):\n    parts = command.lower().split()\n    if not parts:\n        return False\n    action = parts[0]\n\n    if action == "quit":\n        print("Thanks for playing!")\n        return True  # Signal to end game\n\n    if action == "go" and len(parts) > 1:\n        direction = parts[1]\n        room = rooms[player["location"]]\n        if direction in room["exits"]:\n            player["location"] = room["exits"][direction]\n            player["moves"] += 1\n            show_room()\n        else:\n            print(f"You can\'t go {direction} from here!")\n\n    elif action == "take" and len(parts) > 1:\n        item = "_".join(parts[1:])\n        room = rooms[player["location"]]\n        if item in room["items"]:\n            room["items"].remove(item)\n            player["inventory"].append(item)\n            print(f"You picked up the {item}!")\n        else:\n            print(f"There is no {item} here.")\n\n    elif action == "inventory":\n        if player["inventory"]:\n            print("You are carrying: " + ", ".join(player["inventory"]))\n        else:\n            print("Your inventory is empty.")\n\n    elif action == "look":\n        show_room()\n\n    # Add a "use" command for the key!\n    # If player types "use key" in the boss_room and has the key:\n    # -> Open the chest, player wins!\n\n    else:\n        print("Commands: go [dir], take [item], use [item], inventory, look, quit")\n\n    return False\n\ndef check_win():\n    """Check if the player has won the game."""\n    # Win condition: player used the key on the treasure chest\n    # You decide how to track this!\n    # Write your code below\n    return False\n\n# === GAME LOOP ===\nprint("=" * 40)\nprint("  WELCOME TO THE CAVE OF WONDERS")\nprint("  Find the key. Open the chest. Win!")\nprint("=" * 40)\nshow_room()\n\n# The game loop:\n# Keep asking for commands until the player wins or quits\n# Hint:\n# while True:\n#     command = input("\\n> ")\n#     done = process_command(command)\n#     if done or check_win():\n#         break\n# print(f"\\nGame over in {player[\'moves\']} moves!")\n',
            },
            validationFn: 'validate_W5_M6_S3',
            xpReward: 50,
          },
        ],
      },
    ],
  },
];

// ─── Helper utilities ──────────────────────────────────────────────

/** Flat list of every stage in the curriculum, with worldId and missionId attached. */
export interface FlatStage extends Stage {
  worldId: number;
  missionId: number;
}

export function getAllStages(): FlatStage[] {
  const stages: FlatStage[] = [];
  for (const world of CURRICULUM) {
    for (const mission of world.missions) {
      for (const stage of mission.stages) {
        stages.push({ ...stage, worldId: world.id, missionId: mission.id });
      }
    }
  }
  return stages;
}

/** Look up a specific stage by world, mission, and stage id. */
export function getStage(
  worldId: number,
  missionId: number,
  stageId: number,
): Stage | undefined {
  const world = CURRICULUM.find((w) => w.id === worldId);
  if (!world) return undefined;
  const mission = world.missions.find((m) => m.id === missionId);
  if (!mission) return undefined;
  return mission.stages.find((s) => s.id === stageId);
}

/** Total XP available across the entire curriculum. */
export function getTotalCurriculumXP(): number {
  let xp = 0;
  for (const world of CURRICULUM) {
    xp += world.xpBonus;
    for (const mission of world.missions) {
      xp += mission.xpReward;
      for (const stage of mission.stages) {
        xp += stage.xpReward;
      }
    }
  }
  return xp;
}
