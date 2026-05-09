import autocannon from 'autocannon';
import logger from '../utils/logger';
const EXPERT_ID = 'cmoxzhqh10001io7kyqbc3y42';

async function runTest() {
    const result = await autocannon({
        url: 'http://localhost:8080/api/bookings',
        connections: 50,
        duration: 30,
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            expertId: EXPERT_ID,
            name: "Load Tester",
            email: "test@example.com",
            phone: "1234567890",
            date: "2026-05-10",
            timeSlot: "10:00",
            notes: "Testing race conditions"
        }),
        setupClient: (client: any) => {
            // This ensures each request is treated as a fresh attempt
            client.setBody(JSON.stringify({
                expertId: EXPERT_ID,
                name: `Tester ${Math.random()}`,
                email: `test${Math.random()}@example.com`,
                phone: "1234567890",
                date: "2026-05-10",
                timeSlot: "10:00"
            }));
        }
    });

    logger.info('Load Test Completed', {
        totalRequests: result.requests.sent,
        successfulBookings: result['2xx'],
        rejectedBookings: result['4xx'],
    });

    if (result['2xx'] > 1) {
        logger.error('❌ FAILURE: More than one user booked the same slot!', {
            doubleBookings: result['2xx']
        });
    } else {
        logger.info('✅ SUCCESS: Race condition handled. Only 1 booking allowed.');
    }

}

runTest();
