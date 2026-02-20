interface EmailAlertParams {
  risk_level: string;
  risk_percentage: number;
  time: string;
  rainfall: number;
  humidity: number;
  turbidity: number;
  bacteria: number;
  ward: string;
}

// Placeholder configuration - Replace with actual EmailJS credentials
// Note: EmailJS package is not installed. This is a mock implementation.
// To enable real email functionality:
// 1. Install @emailjs/browser package
// 2. Replace SERVICE_ID_HERE, TEMPLATE_ID_HERE, and PUBLIC_KEY_HERE with actual values
// 3. Uncomment the emailjs.send() implementation below

const SERVICE_ID = 'SERVICE_ID_HERE';
const TEMPLATE_ID = 'TEMPLATE_ID_HERE';
const PUBLIC_KEY = 'PUBLIC_KEY_HERE';

export async function sendAlertEmail(params: EmailAlertParams): Promise<void> {
  try {
    // Mock implementation - simulates email sending
    // In production, this would use EmailJS:
    // 
    // import emailjs from '@emailjs/browser';
    // await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    
    console.log('Mock Email Alert - Would send email with the following data:');
    console.log({
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      public_key: PUBLIC_KEY,
      parameters: {
        risk_level: params.risk_level,
        risk_percentage: params.risk_percentage,
        time: params.time,
        rainfall: params.rainfall,
        humidity: params.humidity,
        turbidity: params.turbidity,
        bacteria: params.bacteria,
        ward: params.ward
      }
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate successful email send
    console.log('Mock alert email sent successfully');
    
    // In production with real EmailJS, uncomment this and remove the mock code above:
    /*
    const templateParams = {
      risk_level: params.risk_level,
      risk_percentage: params.risk_percentage,
      time: params.time,
      rainfall: params.rainfall,
      humidity: params.humidity,
      turbidity: params.turbidity,
      bacteria: params.bacteria,
      ward: params.ward
    };

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    */
  } catch (error) {
    console.error('Failed to send alert email:', error);
    throw new Error('Email sending failed. Please check your EmailJS configuration.');
  }
}
