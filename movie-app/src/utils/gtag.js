// Google Analytics utility
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GA_CLIENT_ID = import.meta.env.VITE_GA_CLIENT_ID;

// Initialize Google Analytics by dynamically loading the gtag script
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID is not set.');
    return;
  }

  // Avoid loading the script more than once
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
    return;
  }

  // Load the gtag.js script asynchronously
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());

  // Configure with measurement ID and optional client ID
  const config = {};
  if (GA_CLIENT_ID) {
    config.client_id = GA_CLIENT_ID;
  }

  gtag('config', GA_MEASUREMENT_ID, config);
};

// Track page views — call this on every route change
export const trackPageView = (path) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    ...(GA_CLIENT_ID ? { client_id: GA_CLIENT_ID } : {}),
  });
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (!window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export { GA_MEASUREMENT_ID, GA_CLIENT_ID };
