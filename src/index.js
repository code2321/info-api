addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(segment => segment);

    if (segments.length === 0) {
        return handleRootRequest();
    }

    const [base, id] = segments;

    switch (base) {
        case 'bloodbank':
            return handleBloodbankRequest(id, url.searchParams);
        case 'donor':
            return handleDonorRequest(id, url.searchParams);
        case 'camps':
            return handleCampsRequest(id, url.searchParams);
        case 'events':
            return handleEventsRequest(id, url.searchParams);
        default:
            return new Response('Not Found', { status: 404 });
    }
}

async function handleRootRequest() {
    const html = await fetchHtml();
    return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
    });
}

async function fetchHtml() {
    const response = await fetch('https://prajapatihet.github.io/hospitalinfo-api/index.html');
    return response.text();
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

    data = filterBloodbankData(data, searchParams);

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

    if (searchParams.toString()) {
        data = data.filter(donor => donor.available);
    }

    data = filterDonorData(data, searchParams);

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}

async function handleCampsRequest(id, searchParams) {
    const response = await fetch('https://prajapatihet.github.io/hospitalinfo-api/camps.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let data = await response.json();

    if (id) {
        const item = data.find(camp => camp.id === id);
        if (!item) {
            return new Response('Not Found', { status: 404 });
        }
        return new Response(JSON.stringify(item), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    data = filterCampsOrEventsData(data, searchParams);

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}

async function handleEventsRequest(id, searchParams) {
    const response = await fetch('https://prajapatihet.github.io/hospitalinfo-api/events.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let data = await response.json();

    if (id) {
        const item = data.find(event => event.id === id);
        if (!item) {
            return new Response('Not Found', { status: 404 });
        }
        return new Response(JSON.stringify(item), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    data = filterCampsOrEventsData(data, searchParams);

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}

function normalizeString(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function filterBloodbankData(data, searchParams) {
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
function normalizeBloodGroup(str) {
    return str.replace(/[^a-zA-Z\+\-]/g, '').toLowerCase();
}

function filterDonorData(data, searchParams) {
    let filteredData = data;
    const id = searchParams.get('id');
    const location = searchParams.get('location');
    const bloodgroup = searchParams.get('bloodgroup');

    if (id) {
        filteredData = filteredData.filter(donor => donor.id === id);
    }

    if (location) {
        const normalizedLocation = normalizeString(location);
        filteredData = filteredData.filter(donor => 
            normalizeString(donor.location).includes(normalizedLocation)
        );
    }

    if (bloodgroup) {
        const normalizedBloodgroup = normalizeBloodGroup(bloodgroup);
        filteredData = filteredData.filter(donor => 
            normalizeBloodGroup(donor.bloodgroup) === normalizedBloodgroup
        );
    }

    return filteredData;
}
function filterCampsOrEventsData(data, searchParams) {
    let filteredData = data;
    const location = searchParams.get('location');

    if (location) {
        const normalizedLocation = normalizeString(location);
        filteredData = filteredData.filter(item => 
            normalizeString(item.location).includes(normalizedLocation)
        );
    }

    return filteredData;
}
