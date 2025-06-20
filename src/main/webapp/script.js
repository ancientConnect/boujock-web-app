    window.onload = function() {
            const video = document.getElementById('boujeeVideo');
            if (video) {
                video.muted = true;
                video.play().then(() => {
                    console.log('Video started playing successfully.');
                }).catch(error => {
                    console.error('Autoplay prevented:', error);
                });
            }

            // JavaScript for background soundtrack autoplay
            const audio = document.getElementById('backgroundSoundtrack');
            if (audio) {
                audio.volume = 0.9; // Set a default volume (e.g., 50%)
                audio.play().then(() => {
                    console.log('Soundtrack started playing successfully.');
                }).catch(error => {
                    console.error('Soundtrack autoplay prevented:', error);
                    // If autoplay is blocked, you might want to show a button
                    // for the user to manually start the music.
                });
            }

            // JavaScript for Cyber Background effect
            const canvas = document.getElementById('cyberBackgroundCanvas');
            const ctx = canvas.getContext('2d');

            let width = window.innerWidth;
            let height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Handle canvas resize
            window.addEventListener('resize', () => {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                initializeMatrixEffect(); // Re-initialize drops on resize
            });

            // Characters for the matrix effect (numbers and symbols)
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?`~';
            const fontSize = 16;
            const columns = Math.floor(width / fontSize);

            // Array to store the y-position of each falling character in a column
            const drops = [];
            function initializeMatrixEffect() {
                for (let i = 0; i < columns; i++) {
                    drops[i] = 1; // Start each column at the top
                }
            }

            // Initialize on load
            initializeMatrixEffect();

            // Function to draw the matrix effect
            function drawMatrix() {
                // Dim the old characters slightly to create the trail effect
                ctx.fillStyle = 'rgba(2, 21, 41, 0.05)'; /* Matches body background with transparency */
                ctx.fillRect(0, 0, width, height);

                ctx.fillStyle = '#0F0'; /* Green color for the numbers */
                ctx.font = `${fontSize}px monospace`; /* Monospace font for consistent spacing */

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length));
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;

                    ctx.fillText(text, x, y);

                    // Send the drop back to the top randomly
                    if (y > height && Math.random() > 0.975) {
                        drops[i] = 0; // Reset to top
                    }
                    drops[i]++; // Move the character down
                }
            }

            // Start the animation loop
            setInterval(drawMatrix, 33); // Approximately 30 frames per second
// the api data fetch
        fetch('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=Peacock&origin=*')
    .then(response => response.json())
    .then(data => {
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0]; // get the page ID
        const extract = pages[pageId].extract; // get the extracted text

        // Now, 'extract' contains the introductory text about peacocks.
        // You can process this text to selectively display facts.
        console.log("Full Wikipedia Extract:", extract); // Check what 
        // Call a function to display the facts on your screen
        displayPeacockFacts(extract);
    })
    .catch(error => console.error('Error fetching data from Wikipedia:', error));

        function displayPeacockFacts(text) {
    const factsContainer = document.getElementById('peacock-facts-container'); // You'll need to add this div in your index.html
    if (!factsContainer) {
        console.error("Facts container not found!");
        return;
    }

    // Example of splitting into sentences and filtering based on keywords
    const sentences = text.split(/(?<=[.!?])\s+/); // Splits by common sentence endings
    console.log(sentences); // See how the text is broken down
    const relevantKeywords = [ "feathers", "plumage", "tail", "found in", "native to", "region", "species", "habitat", "diet", "feathers", "display"];
    console.log("Keywords:", relevantKeywords); // Just to confirm
    let selectedFacts = [];

    sentences.forEach(sentence => {
        // Simple check: if a sentence contains any of our keywords (case-insensitive)
        const containsKeyword = relevantKeywords.some(keyword =>
            sentence.toLowerCase().includes(keyword)
        );

        if (containsKeyword && selectedFacts.length < 3) { // Limit to 3 facts for display
            selectedFacts.push(sentence);
            
        }
    });
    console.log("Selected Facts:", selectedFacts); // See what facts were actually picked

    if (selectedFacts.length === 0) {
        factsContainer.innerHTML = "<p>Could not find specific facts, but here's the intro: " + text.substring(0, 200) + "...</p>";
    } else {
        factsContainer.innerHTML = "<h3>Interesting Peacock Facts:</h3>";
        selectedFacts.forEach(fact => {
            factsContainer.innerHTML += `<p>- ${fact}</p>`;
        });
    }
}
        
        
        };




