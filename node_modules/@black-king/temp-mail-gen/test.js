const TempMailGenerator = require('./TempMailGenerator');

const tempMailGen = new TempMailGenerator();

(async () => {
  //create a email
  const email = await tempMailGen.generateEmail();
    console.log('Email:',email)


  // Check for new messages later
  const messages = await tempMailGen.checkMessages(email);
  if (messages.length > 0) {
    messages.forEach(async (message) => {
    
    console.log('Subject:', message);

    // To get email message content
    const content = await tempMailGen.getContent(message.id);

    // If you want message content as html
    console.log("\n==========================================\n")
    console.log('Html:', content);

    //if you want message content as markdown
    const TurndownService = require('turndown'); // make sure to install it, npm install turndown

    const turndownService = new TurndownService();

    console.log("\n==========================================\n")
    const markdownEmail = turndownService.turndown(content);
    
    console.log('Markdown:', markdownEmail);
    
    });
  } else {
    console.log('No new messages.');
  }
})();