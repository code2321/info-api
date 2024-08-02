addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(segment => segment);

    if (segments.length === 0) {
        return new Response('Not Found', { status: 404 });
    }

    const [base, id] = segments;

    switch (base) {
        case 'bloodbank':
            return handleBloodbankRequest(id, url.searchParams);
        case 'donor':
            return handleDonorRequest(id, url.searchParams);
        default:
            return new Response('Not Found', { status: 404 });
    }
}

async function handleBloodbankRequest(id, searchParams) {
    const response = await fetch('https://prajapatihet.github.io/hospitalinfo-api/bloodbank.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let data = await response.json();

    if (id) {
        const item = data.find(bloodbank => bloodbank.id === id);
        if (!item) {
            return new Response('Not Found', { status: 404 });
        }
        return new Response(JSON.stringify(item), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    data = filterData(data, searchParams);

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}

async function handleDonorRequest(id, searchParams) {
    const response = await fetch('https://prajapatihet.github.io/hospitalinfo-api/donorinfo.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let data = await response.json();

    if (id) {
        const item = data.find(donor => donor.id === id);
        if (!item) {
            return new Response('Not Found', { status: 404 });
        }
        return new Response(JSON.stringify(item), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    data = filterData(data, searchParams);

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}

function normalizeString(str) {
    return str.replace(/[^a-zA-Z]/g, '').toLowerCase(); // Remove all non-alphabetic characters and convert to lowercase
}

function filterData(data, searchParams) {
    let filteredData = data;
    const name = searchParams.get('name');
    const loc = searchParams.get('loc');
    const add = searchParams.get('add');

    if (name) {
        const normalizedName = normalizeString(name);
        filteredData = filteredData.filter(item => 
            normalizeString(item.name).includes(normalizedName)
        );
    }

    if (loc) {
        const normalizedLoc = normalizeString(loc);
        filteredData = filteredData.filter(item => 
            normalizeString(item.loc).includes(normalizedLoc)
        );
    }

    if (add) {
        const normalizedAdd = normalizeString(add);
        filteredData = filteredData.filter(item => 
            normalizeString(item.add).includes(normalizedAdd)
        );
    }

    return filteredData;
}
