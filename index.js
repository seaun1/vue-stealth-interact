/**
 * Vue-Stealth-Interact
 * A lightweight utility to bypass Vue.js / Element-UI virtual DOM restrictions 
 * in automated testing and RPA scripts.
 */
class VueStealthInteract {
    constructor() {
        this.internalAxios = null;
    }

    /**
     * Deep scan DOM tree to extract internal Vue2 (__vue__) or Vue3 (__vue_app__) instances.
     * Useful for intercepting internal HTTP clients or state managers.
     */
    findVueInstance() {
        if (this.internalAxios) return this.internalAxios;
        
        const rootElements = document.querySelectorAll('#app, .layout, .el-table, div');
        for (let el of rootElements) {
            // Vue 2 extraction
            if (el.__vue__) {
                const client = el.__vue__.$http || el.__vue__.$axios || el.__vue__.$request;
                if (client && typeof client.post === 'function') {
                    this.internalAxios = client;
                    return client;
                }
            }
            // Vue 3 extraction
            if (el.__vue_app__) {
                const globalProps = el.__vue_app__.config?.globalProperties;
                if (globalProps) {
                    const client = globalProps.$http || globalProps.$axios || globalProps.$request;
                    if (client && typeof client.post === 'function') {
                        this.internalAxios = client;
                        return client;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Force trigger UI framework events (e.g., Element-UI dropdowns)
     * bypassing physical click prevention or overlay issues.
     */
    forceTriggerUIEvent(element) {
        if (!element) return;
        try {
            const rect = element.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const evOpts = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy };
            
            element.dispatchEvent(new PointerEvent('pointerdown', evOpts));
            element.dispatchEvent(new MouseEvent('mousedown', evOpts));
            element.dispatchEvent(new PointerEvent('pointerup', evOpts));
            element.dispatchEvent(new MouseEvent('mouseup', evOpts));
            element.dispatchEvent(new MouseEvent('click', evOpts));
            element.click();
            
            // Force invoke Element-UI internal selection method if available
            if (element.__vue__ && typeof element.__vue__.selectOptionClick === 'function') {
                element.__vue__.selectOptionClick();
            }
        } catch (e) {
            try { element.click(); } catch (err) {}
        }
    }
}

export default new VueStealthInteract();