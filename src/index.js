// src/index.js
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
    // Fetch data from the given URL
    const response = await fetch('https://prajapatihet.github.io/hospitalinfo-api/bloodbank.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Retrieve the data from the response
    const data = await response.json();

    // Return the data as a new response
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}
