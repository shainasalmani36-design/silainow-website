(() => {
  // Set this to the approved public SilaiNow business WhatsApp number before publishing.
  // Use country code followed by digits only; leave empty until a public number is approved.
  const WHATSAPP_NUMBER = '';
  const languageButton = document.querySelector('.language-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  let language = 'en';

  languageButton.addEventListener('click', () => {
    language = language === 'en' ? 'hi' : 'en';
    document.documentElement.lang = language;
    document.querySelectorAll('[data-en][data-hi]').forEach((element) => {
      element.textContent = element.dataset[language];
    });
    languageButton.textContent = language === 'en' ? 'हिंदी' : 'English';
    languageButton.setAttribute('aria-label', language === 'en' ? 'Switch language to Hindi' : 'Switch language to English');
    document.title = language === 'en'
      ? 'SilaiNow — Stitching and alterations at your doorstep'
      : 'SilaiNow — सिलाई और अल्टरेशन आपके दरवाज़े पर';
  });

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    menuButton.textContent = isOpen ? '×' : '☰';
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  }));

  document.querySelectorAll('.whatsapp-link').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
      window.alert('Add the approved business WhatsApp number in script.js before using this link.');
      return;
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank', 'noopener,noreferrer');
  }));

  const form = document.querySelector('.booking-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      window.alert('Add the approved business WhatsApp number in script.js before using booking.');
      return;
    }
    const pickup = new Date(data.get('time'));
    const formattedPickup = Number.isNaN(pickup.getTime())
      ? data.get('time')
      : pickup.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN', {
          dateStyle: 'medium', timeStyle: 'short'
        });
    const message = language === 'hi'
      ? `नमस्ते SilaiNow! मैं पिकअप बुक करना चाहता/चाहती हूँ।\nनाम: ${data.get('name')}\nफ़ोन: ${data.get('phone')}\nपता: ${data.get('address')}\nसेवा: ${data.get('service')}\nपसंदीदा समय: ${formattedPickup}`
      : `Hello SilaiNow! I'd like to book a pickup.\nName: ${data.get('name')}\nPhone: ${data.get('phone')}\nAddress: ${data.get('address')}\nService: ${data.get('service')}\nPreferred pickup: ${formattedPickup}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
})();
