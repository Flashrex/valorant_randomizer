export default function getLanguageTag(language: string): string {
    switch(language) {
        case 'de':
            return 'de-DE';
        case 'us':
            return 'en-US';
        case 'es':
            return 'es-ES';
        case 'fi':
            return 'en-US'; // valorant-api.com doesn't have a Finnish translation
        case 'fr':
            return 'fr-FR';
        case 'it':
            return 'it-IT';
        default:
            return 'en-US';
    }
}