
import { App as CapacitorApp } from '@capacitor/app';
import {
    useNavigate,
    useLocation,
    useNavigationType
} from 'react-router-dom';
import { useEffect, useRef } from 'react';

const BackButtonHandler = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const navigationType = useNavigationType();

    const historyStack = useRef([location.key]);

    useEffect(() => {
        const stack = historyStack.current;
        const currentKey = location.key;

        if (navigationType === 'PUSH') {
            stack.push(currentKey);
        } else if (navigationType === 'REPLACE') {
            stack[stack.length - 1] = currentKey;
        } else if (navigationType === 'POP') {
            const previousIndex = stack.lastIndexOf(currentKey);
            if (previousIndex !== -1) {
                stack.splice(previousIndex + 1);
            } else {
                stack.length = 0;
                stack.push(currentKey);
            }
        }

    }, [location, navigationType]);
    
    useEffect(() => {

        const backButton = CapacitorApp.addListener(
            'backButton',
            () => {
                if (historyStack.current.length > 1) {
                    navigate(-1);
                } else {
                    CapacitorApp.exitApp();
                }
            }
        );

        return () => {
            backButton.then(listener => listener.remove());
        };
    }, [navigate]);
    return null;
};

export default BackButtonHandler;
