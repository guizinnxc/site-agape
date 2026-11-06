const WHATSAPP = 'https://wa.me/5524981100190';

export function whatsappUrl(message) {
  return message ? `${WHATSAPP}?text=${encodeURIComponent(message)}` : WHATSAPP;
}

export function directionsUrl({ lat, lng }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
