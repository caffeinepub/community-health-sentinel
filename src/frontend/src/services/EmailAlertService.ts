interface EmailAlertParams {
  risk_level: string;
  risk_percentage: number;
  time: string;
  rainfall: number;
  humidity: number;
  turbidity: number;
  bacteria: number;
  ward: string;
  priority_score: number;
}

export async function sendAlertEmail(params: EmailAlertParams): Promise<void> {
  // Check if emailjs is available
  if (typeof window !== 'undefined' && (window as any).emailjs) {
    const emailjs = (window as any).emailjs;
    
    try {
      await emailjs.send(
        'SERVICE_ID_HERE',
        'TEMPLATE_ID_HERE',
        {
          risk_level: params.risk_level,
          risk_percentage: params.risk_percentage,
          time: params.time,
          rainfall: params.rainfall,
          humidity: params.humidity,
          turbidity: params.turbidity,
          bacteria: params.bacteria,
          ward: params.ward,
          priority_score: params.priority_score
        },
        'PUBLIC_KEY_HERE'
      );
    } catch (error) {
      throw new Error('EmailJS send failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  } else {
    // Simulate email sending for demo purposes
    console.log('EmailJS not loaded. Simulating email send with params:', params);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success (in production, this would throw an error)
    console.log('✅ Email alert simulated successfully');
  }
}
