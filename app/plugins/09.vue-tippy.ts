import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(
        VueTippy,
        {
            directive: 'tippy',
            defaultProps: {
                placement: 'auto-end',
                allowHTML: true,
            }
        },
    )
})
