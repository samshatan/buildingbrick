import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

function Contact() {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Need help with hiring or worker registration? Have a question about our platform? Send us a message and our team will get back to you promptly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="bg-gradient-to-br from-primary-900 to-primary-950 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-primary-100/80 font-medium mb-10">
                Fill up the form and our Team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-200 font-semibold mb-1">Phone</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-200 font-semibold mb-1">Email</p>
                    <p className="font-medium">support@brickourhouse.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-200 font-semibold mb-1">Office</p>
                    <p className="font-medium leading-relaxed">123 Builder Avenue<br/>Innovation District, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                 {/* Social Placeholder 1 */}
                 <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    required 
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 font-medium"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    required 
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 font-medium"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 font-medium"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Your Message</label>
                <div className="relative">
                  <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <textarea 
                    id="message" 
                    required 
                    rows={5}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-gray-900 font-medium resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg w-full md:w-auto"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;
