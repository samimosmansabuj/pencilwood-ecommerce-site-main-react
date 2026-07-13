import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { useToast } from '../context/ToastContext';

export default function ContactUs() {
  const toast = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast("Please fill out all required fields.");
      return;
    }
    // Simulate sending message
    toast("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      <div className="page" style={{ paddingTop: '20px' }}>
        <div className="lp-section">
          <div className="lp-head">
            <div className="lp-title">Get In Touch</div>
          </div>
          <div className="lp-body">
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              
              {/* Contact Information */}
              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--br)', marginBottom: '15px' }}>Contact Information</h3>
                <p style={{ fontSize: '13px', color: 'var(--mid)', marginBottom: '20px', lineHeight: '1.6' }}>
                  Have questions, concerns, or feedback? We'd love to hear from you. Reach out to us through any of the channels below.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ fontSize: '20px' }}>📍</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text)' }}>Address</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--mid)' }}>123 Leather Craft Avenue,<br/>Dhaka, Bangladesh</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ fontSize: '20px' }}>📞</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text)' }}>Phone</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--mid)' }}>+880 1234-567890</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ fontSize: '20px' }}>✉️</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text)' }}>Email</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--mid)' }}>support@pencilwoodbd.com</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ fontSize: '20px' }}>🕒</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text)' }}>Business Hours</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--mid)' }}>Sunday - Thursday: 9:00 AM - 6:00 PM<br/>Friday - Saturday: Closed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div style={{ background: 'var(--cream)', padding: '20px', borderRadius: 'var(--r)', border: '1px solid var(--border-l)' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--text)', marginBottom: '15px' }}>Send us a Message</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name *" 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', fontFamily: 'var(--ff)' }}
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email *" 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', fontFamily: 'var(--ff)' }}
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject" 
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', fontFamily: 'var(--ff)' }}
                    />
                  </div>
                  <div>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message *" 
                      rows="5"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', fontFamily: 'var(--ff)', resize: 'vertical' }}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-buy" style={{ width: '100%' }}>Send Message</button>
                </form>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
