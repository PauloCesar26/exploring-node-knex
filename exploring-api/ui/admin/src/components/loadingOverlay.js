const qs = document.querySelector.bind(document);

export const loadingOverlay = {
    show(){
        this.hide();

        qs("body").insertAdjacentHTML("beforeend", 
        `
            <div id="loadingOverlay">
                <div class="
                    fixed 
                    top-0 
                    left-0
                    w-full
                    h-full
                    bg-red-900
                    opacity-90
                    z-50
                    flex
                    items-center
                    justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle animate-spin text-white"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </div>
            </div>
        `);
    },
    hide(){
        qs("#loadingOverlay")?.remove();
    }
}