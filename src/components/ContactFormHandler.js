'use client';

import { useEffect } from 'react';

export default function ContactFormHandler() {
  useEffect(() => {
    const handleFormSubmit = async (e) => {
      // Check if the submitted form is a Contact Form 7 or Elementor form
      const form = e.target;
      if (form.tagName.toLowerCase() !== 'form') return;
      
      const isContactForm = form.classList.contains('wpcf7-form') || form.classList.contains('elementor-form');
      if (!isContactForm) return;

      e.preventDefault();
      
      // Find or create a status message container
      let statusContainer = form.querySelector('.wpcf7-response-output, .elementor-message');
      if (!statusContainer) {
        statusContainer = document.createElement('div');
        statusContainer.className = 'mt-4 p-3 rounded-lg text-sm font-medium';
        form.appendChild(statusContainer);
      }
      
      statusContainer.textContent = 'Sending message...';
      statusContainer.style.display = 'block';
      statusContainer.style.backgroundColor = '#eef2ff';
      statusContainer.style.color = '#4f46e5';
      
      // Extract form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        const result = await res.json();
        
        if (res.ok) {
          statusContainer.textContent = result.message || 'Thank you for your message. It has been sent.';
          statusContainer.style.backgroundColor = '#dcfce7';
          statusContainer.style.color = '#166534';
          form.reset();
        } else {
          throw new Error(result.error || 'Failed to send');
        }
      } catch (err) {
        console.error(err);
        statusContainer.textContent = 'One or more fields have an error. Please check and try again.';
        statusContainer.style.backgroundColor = '#fee2e2';
        statusContainer.style.color = '#991b1b';
      }
      
      // Hide message after 5 seconds
      setTimeout(() => {
        statusContainer.style.display = 'none';
      }, 5000);
    };

    document.addEventListener('submit', handleFormSubmit);
    
    return () => {
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, []);

  return null;
}
