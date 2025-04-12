export default function isRootClient(): boolean {
    const session = useSessionStore();

    return session.client?.id === 1;
}
