export default function scrollToId(id: string, offset?: number) {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        const yOffset = offset ?? 0;
        const element = document.getElementById(id);

        if (null !== element) {
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

            if (window.scrollY > y) {
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }
    }
}
