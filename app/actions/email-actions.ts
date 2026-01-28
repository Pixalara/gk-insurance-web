'use server';

import nodemailer from 'nodemailer';

// Updated interface to include DOB
interface EmailPayload {
    name: string;
    phone: string;
    email?: string;
    insurance_type: string;
    vehicle_number?: string;
    dob?: string; // Added optional dob property
    message?: string;
}

export async function sendQuoteEmail(data: EmailPayload) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, // Admin email
            pass: process.env.EMAIL_PASS, // App Password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to Admin
        subject: `New Quote Request: ${data.insurance_type} - ${data.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #004aad;">New Insurance Quote Request</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
                <p><strong>Insurance Type:</strong> ${data.insurance_type}</p>
                ${data.dob ? `<p><strong>Date of Birth:</strong> ${data.dob}</p>` : ''}
                ${data.vehicle_number ? `<p><strong>Vehicle Number:</strong> ${data.vehicle_number}</p>` : ''}
                <p><strong>Message:</strong></p>
                <p style="background: #f9f9f9; padding: 10px; border-radius: 5px;">${data.message || 'No message provided'}</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}