// import { EmailTemplate } from '@/app/[locale]/(teacher)/(dashboard)/settings/notifications/EmailTemplate';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { Resend } from 'resend';

// const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

// export async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const method = req.method?.toLowerCase();
//     if (method === "post")
//     {
//         try {
//         const result = await resend.emails.send({
//         from: 'lemaildejo@gmail.com',
//         to: ['jcourtoi@student.42.fr'],
//         subject: 'Test email',
//         react: EmailTemplate({ name: 'Johanna' }),
//         });

//         console.log(result.data);
//         res.status(200).json({ message: 'Email sent successfully !', data: result.data });
//         } catch (error) {
//             console.error('Error sending email:', error);
//             res.status(500).json({ message: 'Error sending email.', error });
//         }
//     }
  
// }
