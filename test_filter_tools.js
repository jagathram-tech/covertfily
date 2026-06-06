const assert = require('assert');

// Mock DOM elements
const noResults = { style: { display: 'none' } };

// Mock document
global.document = {
    getElementById: (id) => {
        if (id === 'dashboardNoResults') return noResults;
        return null;
    }
};

// Create some mock cards
const cards = [
    {
        dataset: { category: 'pdf' },
        style: { display: 'none' },
        querySelector: (selector) => {
            if (selector === 'h3') return { textContent: 'Merge PDF' };
            if (selector === 'p') return { textContent: 'Combine PDF files' };
        }
    },
    {
        dataset: { category: 'image' },
        style: { display: 'none' },
        querySelector: (selector) => {
            if (selector === 'h3') return { textContent: 'Resize Image' };
            if (selector === 'p') return { textContent: 'Change image size' };
        }
    }
];

// Initial state variables from index.html
let activeCategory = 'all';
let searchQuery = '';

// Optimized function to test
// Cache the cards upfront
const cachedCards = Array.from(cards).map(card => ({
    element: card,
    category: card.dataset.category,
    title: card.querySelector('h3').textContent.toLowerCase(),
    desc: card.querySelector('p').textContent.toLowerCase()
}));

function filterTools() {
    let visibleCount = 0;

    cachedCards.forEach(cached => {
        const matchesCategory = (activeCategory === 'all') ||
                                (cached.category === activeCategory) ||
                                (activeCategory === 'generate' && (cached.category === 'generate' || cached.category === 'utility'));
        const matchesSearch = cached.title.includes(searchQuery) || cached.desc.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
            cached.element.style.display = 'flex';
            visibleCount++;
        } else {
            cached.element.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

// Test 1: Empty search, all categories
activeCategory = 'all';
searchQuery = '';
filterTools();
assert.strictEqual(cards[0].style.display, 'flex');
assert.strictEqual(cards[1].style.display, 'flex');
assert.strictEqual(noResults.style.display, 'none');

// Test 2: Search for 'pdf'
searchQuery = 'pdf';
filterTools();
assert.strictEqual(cards[0].style.display, 'flex');
assert.strictEqual(cards[1].style.display, 'none');
assert.strictEqual(noResults.style.display, 'none');

// Test 3: Filter by category 'image'
activeCategory = 'image';
searchQuery = '';
filterTools();
assert.strictEqual(cards[0].style.display, 'none');
assert.strictEqual(cards[1].style.display, 'flex');
assert.strictEqual(noResults.style.display, 'none');

// Test 4: No results
activeCategory = 'pdf';
searchQuery = 'resize';
filterTools();
assert.strictEqual(cards[0].style.display, 'none');
assert.strictEqual(cards[1].style.display, 'none');
assert.strictEqual(noResults.style.display, 'block');

console.log("test_filter_tools passed!");
