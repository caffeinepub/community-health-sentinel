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

/**
 * Validate template parameters before sending
 * Ensures all critical fields are present and properly formatted
 */
function validateTemplateParams(params: EmailAlertParams): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  // Check critical fields
  if (!params.risk_level || params.risk_level.trim() === '') {
    missingFields.push('risk_level');
  }
  if (params.risk_percentage === undefined || params.risk_percentage === null) {
    missingFields.push('risk_percentage');
  }
  if (!params.ward || params.ward.trim() === '') {
    missingFields.push('ward');
  }
  
  // Check optional but important fields
  if (params.rainfall === undefined || params.rainfall === null) {
    missingFields.push('rainfall');
  }
  if (params.humidity === undefined || params.humidity === null) {
    missingFields.push('humidity');
  }
  if (params.turbidity === undefined || params.turbidity === null) {
    missingFields.push('turbidity');
  }
  if (params.bacteria === undefined || params.bacteria === null) {
    missingFields.push('bacteria');
  }
  if (params.priority_score === undefined || params.priority_score === null) {
    missingFields.push('priority_score');
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

export async function sendAlertEmail(params: EmailAlertParams): Promise<void> {
  console.group('📧 Email Alert Service');
  console.log('Attempting to send alert email');
  console.log('Timestamp:', new Date().toISOString());
  
  // Validate parameters
  const validation = validateTemplateParams(params);
  console.log('Parameter validation:', validation);
  
  if (!validation.isValid) {
    console.error('❌ Missing required parameters:', validation.missingFields);
    
    // Check if critical fields are missing
    const criticalFields = ['risk_level', 'risk_percentage', 'ward'];
    const missingCritical = validation.missingFields.filter(f => criticalFields.includes(f));
    
    if (missingCritical.length > 0) {
      console.groupEnd();
      throw new Error(`Critical parameters missing: ${missingCritical.join(', ')}`);
    }
  }
  
  // Format time parameter as human-readable IST string
  const formattedTime = params.time || new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium'
  });
  
  // Prepare template parameters
  const templateParams = {
    risk_level: params.risk_level,
    risk_percentage: params.risk_percentage.toFixed(1),
    time: formattedTime,
    rainfall: params.rainfall.toFixed(1),
    humidity: params.humidity.toFixed(1),
    turbidity: params.turbidity.toFixed(1),
    bacteria: params.bacteria.toFixed(1),
    ward: params.ward,
    priority_score: params.priority_score.toFixed(1)
  };
  
  console.log('Template parameters (formatted):', JSON.stringify(templateParams, null, 2));
  
  // Check if emailjs is available
  if (typeof window === 'undefined' || !(window as any).emailjs) {
    console.error('❌ EmailJS library not loaded');
    console.error('Please ensure EmailJS SDK is included in index.html');
    console.groupEnd();
    throw new Error('EmailJS Configuration Error: EmailJS library not loaded. Please check your internet connection and ensure the EmailJS SDK is properly included.');
  }
  
  const emailjs = (window as any).emailjs;
  
  try {
    console.log('EmailJS Configuration:');
    console.log('  Service ID: service_hf3e6oq');
    console.log('  Template ID: template_3dldpfg');
    console.log('  Public Key: KHu3JNagt... (first 10 chars)');
    console.log('Calling emailjs.send()...');
    
    const response = await emailjs.send(
      'service_hf3e6oq',
      'template_3dldpfg',
      templateParams,
      'KHu3JNagtUgZCsDcG'
    );
    
    console.log('✅ EmailJS send successful');
    console.log('Response status:', response.status);
    console.log('Response text:', response.text);
    console.log('Full response:', response);
    console.log('Email sent at:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.groupEnd();
    
  } catch (error: any) {
    console.error('❌ EmailJS send failed');
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error status:', error?.status);
    console.error('Full error object:', error);
    
    // Categorize error for user-friendly message
    let errorMessage = 'Failed to send email';
    
    if (error?.message?.toLowerCase().includes('configuration') || 
        error?.message?.toLowerCase().includes('invalid')) {
      errorMessage = `EmailJS Configuration Error: ${error.message}. Please verify service ID, template ID, and public key.`;
    } else if (error?.message?.toLowerCase().includes('network') || 
               error?.message?.toLowerCase().includes('fetch')) {
      errorMessage = `Network Error: ${error.message}. Please check your internet connection.`;
    } else if (error?.message?.toLowerCase().includes('template')) {
      errorMessage = `Template Error: ${error.message}. Please verify the EmailJS template configuration.`;
    } else if (error?.status === 429 || 
               error?.message?.toLowerCase().includes('rate limit')) {
      errorMessage = 'Rate Limit Exceeded: Too many emails sent. Please try again later.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    console.groupEnd();
    throw new Error(errorMessage);
  }
}
