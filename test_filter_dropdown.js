const assert = require('assert');

// Mock DOM elements
const noResults = { style: { display: 'none' } };

// Mock item class logic
class MockItem {
    constructor(text) {
        this.textContent = text;
        this.classes = new Set();
        // Simulate missing _cachedText
        this._cachedText = undefined;
    }

    get classList() {
        return {
            toggle: (className, force) => {
                if (force) this.classes.add(className);
                else this.classes.delete(className);
            }
        };
    }
}

const items = [
    new MockItem('PDF Document'),
    new MockItem('JPG Image'),
    new MockItem('PNG Image')
];

const labels = [
    { style: { display: 'none' } },
    { style: { display: 'none' } }
];

const mockContainer = {
    querySelectorAll: (selector) => {
        if (selector === '.dropdown-item') return items;
        if (selector === '.dropdown-group-label') return labels;
    },
    parentElement: {
        querySelector: (selector) => {
            if (selector === '.no-results') return noResults;
        }
    }
};

global.document = {
    getElementById: (id) => {
        if (id === 'testContainer') return mockContainer;
        return null;
    }
};

// The function we want to optimize
function filterDropdownItems(input, containerId) {
    const query = input.value.toLowerCase();
    const container = document.getElementById(containerId);
    if (!container) return;
    let visible = 0;
    container.querySelectorAll('.dropdown-item').forEach(item => {
        // Optimization: Cache textContent on the element to avoid DOM reads
        if (item._cachedText === undefined) {
            item._cachedText = item.textContent.toLowerCase();
        }
        const match = item._cachedText.includes(query);
        item.classList.toggle('hidden', !match);
        if (match) visible++;
    });
    container.querySelectorAll('.dropdown-group-label').forEach(l => l.style.display = 'block');
    const noResults = container.parentElement.querySelector('.no-results');
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
}

// Test 1: Empty search, all show
filterDropdownItems({ value: '' }, 'testContainer');
assert.strictEqual(items[0].classes.has('hidden'), false);
assert.strictEqual(items[1].classes.has('hidden'), false);
assert.strictEqual(items[2].classes.has('hidden'), false);
assert.strictEqual(noResults.style.display, 'none');

// Test 2: Search for 'pdf'
filterDropdownItems({ value: 'pdf' }, 'testContainer');
assert.strictEqual(items[0].classes.has('hidden'), false);
assert.strictEqual(items[1].classes.has('hidden'), true);
assert.strictEqual(items[2].classes.has('hidden'), true);
assert.strictEqual(noResults.style.display, 'none');

// Test 3: Search for 'image'
filterDropdownItems({ value: 'image' }, 'testContainer');
assert.strictEqual(items[0].classes.has('hidden'), true);
assert.strictEqual(items[1].classes.has('hidden'), false);
assert.strictEqual(items[2].classes.has('hidden'), false);
assert.strictEqual(noResults.style.display, 'none');

// Test 4: Search for nothing found
filterDropdownItems({ value: 'xyz' }, 'testContainer');
assert.strictEqual(items[0].classes.has('hidden'), true);
assert.strictEqual(items[1].classes.has('hidden'), true);
assert.strictEqual(items[2].classes.has('hidden'), true);
assert.strictEqual(noResults.style.display, 'block');

// Verify that _cachedText was correctly populated and used
assert.strictEqual(items[0]._cachedText, 'pdf document');
assert.strictEqual(items[1]._cachedText, 'jpg image');
assert.strictEqual(items[2]._cachedText, 'png image');

console.log("test_filter_dropdown passed!");
