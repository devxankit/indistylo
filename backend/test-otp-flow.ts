async function testOTP() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: '6268423925' })
        });
        const data = await response.json();
        console.log('Send OTP Response:', data);

        if (data.success && data.otp) {
            const verifyResponse = await fetch('http://localhost:3000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: '6268423925', otp: data.otp, role: 'VENDOR' })
            });
            const verifyData = await verifyResponse.json();
            console.log('Verify OTP Response:', verifyData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testOTP();
