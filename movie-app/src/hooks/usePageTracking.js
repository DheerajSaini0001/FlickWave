import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/gtag';

/**
 * Custom hook to track page views on route changes.
 * Should be used once in the App component.
 */
const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location]);
};

export default usePageTracking;
