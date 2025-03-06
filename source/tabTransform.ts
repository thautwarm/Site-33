export function tabTransform(site: Lume.Site) {
    site.process([".html"], (pages) => {
        for (const page of pages) {
            if (!page.document) continue;

            // Transform tabs structure
            transformTabs(page.document);
        }
    });
}

/**
 * Transforms tab structures from the original format to the site33 format
 *
 * Original format:
 * <div class="tabs-tabs-wrapper" data-id="...">
 *   <div class="tabs-tabs-header">
 *     <button type="button" class="tabs-tab-button" data-tab="0">Tab1</button>
 *     ...
 *   </div>
 *   <div class="tabs-tabs-container">
 *     <div class="tabs-tab-content" data-index="0">Content1</div>
 *     ...
 *   </div>
 * </div>
 *
 * Target format:
 * <div class="site33-tabs">
 *   <input type="radio" name="site33-tabs" id="site33-tab1" checked>
 *   <label for="site33-tab1">Tab1</label>
 *   ...
 *   <div class="site33-tab-content" id="site33-content1">Content1</div>
 *   ...
 * </div>
 */
function transformTabs(document: Document) {
    const tabWrappers = document.querySelectorAll('.tabs-tabs-wrapper');

    tabWrappers.forEach((wrapper, index) => {
        const dataId = wrapper.getAttribute('data-id') || `tab-${index}`;
        // const tabsContainer = wrapper.querySelector('.tabs-tabs-container');
        const tabButtons = wrapper.querySelectorAll('.tabs-tab-button');
        const tabContents = wrapper.querySelectorAll('.tabs-tab-content');

        // Create new tabs container
        const newTabsContainer = document.createElement('div');
        newTabsContainer.className = 'site33-tabs';

        // Process each tab
        tabButtons.forEach((button, index) => {
            const tabIndex = index + 1;
            const tabId = `${dataId}-${tabIndex}`;
            const tabText = button.textContent?.trim() || '';

            // Create radio input
            const input = document.createElement('input');
            input.setAttribute("type", "radio");
            input.setAttribute("name", `site33-tabs/${dataId}`);
            input.setAttribute("id", tabId);
            if (index === 0) {
                input.setAttribute("checked", "checked");
            }

            // Create label
            const label = document.createElement('label');
            label.setAttribute('for', tabId);
            label.textContent = tabText;

            // Add input and label to new container
            newTabsContainer.appendChild(input);
            newTabsContainer.appendChild(label);
        });

        // Process tab contents
        tabContents.forEach((content, index) => {
            // Create new content div
            const newContent = document.createElement('div');
            newContent.className = 'site33-tab-content';
            newContent.setAttribute("style", "min-height: 6em;");

            // Copy the content
            while (content.firstChild) {
                newContent.appendChild(content.firstChild);
            }

            // Add content to new container
            newTabsContainer.appendChild(newContent);
        });

        // Replace old wrapper with new tabs container
        wrapper.parentNode?.replaceChild(newTabsContainer, wrapper);
    });
}
