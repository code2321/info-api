addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
    const url = new URL(request.url);

    switch (url.pathname) {
        case '/bloodbank':
            return handleBloodbankRequest();
        case '/donor':
            return handleDonorRequest();
        default:
            return new Response('Not Found', { status: 404 });
    }
}

async function handleBloodbankRequest() {
    const response = await fetch('https://prajapatihet.github.io/hospitalinfo-api/bloodbank.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}

async function handleDonorRequest() {
    const response = await fetch('https://prajapatihet.github.io/hospitalinfo-api/donorinfo.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}
