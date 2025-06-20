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

            // enabling background soundtrack autoplay
            const audio = document.getElementById('backgroundSoundtrack');
            if (audio) {
                audio.volume = 0.9; // setting default volume to 50%
                audio.play().then(() => {
                    console.log('Soundtrack started playing successfully.');
                }).catch(error => {
                    console.error('Soundtrack autoplay prevented:', error);
                            });
            }
// KELVIN the 1st doing his thang! lol
            // enabling the  cyber background effect
            const canvas = document.getElementById('cyberBackgroundCanvas');
            const ctx = canvas.getContext('2d');

            let width = window.innerWidth;
            let height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // handling the canvas resize
            window.addEventListener('resize', () => {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                initializeMatrixEffect(); // re-initializing drops on resize
            });

            // characters for the matrix effect i.e numbers and symbols
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?`~';
            const fontSize = 14;
            const columns = Math.floor(width / fontSize);

            // this array will store the y-position of each falling character in a column
            const drops = [];
            function initializeMatrixEffect() {
                for (let i = 0; i < columns; i++) {
                    drops[i] = 1; // starting each column at the top
                }
            }

            // initializing on load
            initializeMatrixEffect();

            // function to draw the matrix effect
            function drawMatrix() {
                // dimming the old characters slightly to create the trail effect
                ctx.fillStyle = 'rgba(2, 21, 41, 0.05)'; /* this will match body background with transparency */
                ctx.fillRect(0, 0, width, height);

                ctx.fillStyle = '#8A2BE2';
                ctx.font = `${fontSize}px monospace`; /*this monospace font allows consistent spacing */

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length));
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;

                    ctx.fillText(text, x, y);

                    // randomly sending the drop back to the top
                    if (y * fontSize > height && Math.random() > 0.975) {
                        drops[i] = 0; // resetting to the top
                    }
                    drops[i]++; // moving the character down
                }
            }
// KELVIN the 1st doing his thang! lol
            // starting the animation loop
            setInterval(drawMatrix, 33); // ok this sets about 30 frames per second
        }
