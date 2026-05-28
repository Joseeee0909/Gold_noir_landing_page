const WA_NUMBER = "573145868426";
const IG_HANDLE = "gold.noir_";

export function whatsappLink(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function floatingWhatsAppLink(message) {
  return whatsappLink(message);
}

export function instagramLink() {
  return `https://instagram.com/${IG_HANDLE}`;
}