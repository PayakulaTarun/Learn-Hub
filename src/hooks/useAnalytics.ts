import { useRef, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // UPDATED

export type ActivityEventType = 'view' | 'solve' | 'run' | 'login' | 'test_attempt' | 'roadmap_step' | 'resume_usage';
export type EntityType = 'tutorial' | 'problem' | 'mock_test' | 'roadmap' | 'tool';

export function useAnalytics() {
    const { user } = useAuth();
    const sessionStartTime = useRef<number>(Date.now());

    // Track a discrete event (e.g., code run, problem solved)
    const trackEvent = async (
        eventType: ActivityEventType,
        entityType: EntityType,
        entityId: string,
        metadata: Record<string, any> = {},
        durationMs: number = 0
    ) => {
        if (!user) return;

        try {
            await addDoc(collection(db, 'user_activity_events'), {
                user_id: user.uid,
                event_type: eventType,
                entity_type: entityType,
                entity_id: entityId,
                metadata: metadata,
                duration_ms: durationMs,
                created_at: serverTimestamp()
            });
        } catch (err) {
            console.warn('[Analytics] Failed to track event:', err);
        }
    };

    // Track time spent on a page/component
    const trackTimeSpent = (entityType: EntityType, entityId: string, metadata: Record<string, any> = {}) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const startTime = Date.now();

            return () => {
                const endTime = Date.now();
                const duration = endTime - startTime;

                // Only track meaningful time (> 5 seconds)
                if (duration > 5000) {
                    trackEvent('view', entityType, entityId, metadata, duration);
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [entityId]); // Re-run if entityId changes
    };

    return { trackEvent, trackTimeSpent };
}
