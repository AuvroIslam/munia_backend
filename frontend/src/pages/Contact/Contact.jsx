import React from "react";
import { Mail, Phone, MapPin, MessageCircle, HelpCircle, Bug, DollarSign } from "lucide-react";

const Contact = () => {
  return (
  <div className="min-h-screen bg-gradient-to-b from-white to-violet-50 dark:from-gray-950 dark:to-gray-900 py-8 px-2 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Form */}
  <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-violet-200 dark:border-gray-800 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-7 h-7 text-violet-500 dark:text-violet-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Send us a Message</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-300 mb-6 text-lg">Fill out the form below and we'll get back to you as soon as possible</p>
          <form className="space-y-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block font-bold mb-1 text-gray-900 dark:text-white text-left">Full Name</label>
                <input type="text" placeholder="Your full name" className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 border-none px-4 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-800" />
              </div>
              <div className="flex-1">
                <label className="block font-bold mb-1 text-gray-900 dark:text-white text-left">Email Address</label>
                <input type="email" placeholder="your.email@example.com" className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 border-none px-4 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-800" />
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1 text-gray-900 dark:text-white text-left">Category</label>
              <select className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 border-none px-4 py-3 text-base text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-800">
                <option value="">Select a category</option>
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Feedback</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1 text-gray-900 dark:text-white text-left">Subject</label>
              <input type="text" placeholder="Brief description of your inquiry" className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 border-none px-4 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-800" />
            </div>
            <div>
              <label className="block font-bold mb-1 text-gray-900 dark:text-white text-left">Message</label>
              <textarea rows={3} placeholder="Please provide details about your inquiry..." className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 border-none px-4 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-800" />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg text-white font-semibold text-lg bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 transition-all mt-2">Send Message</button>
          </form>
        </div>
        {/* Contact Info */}
        <div className="flex flex-col gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-violet-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="font-semibold text-xl mb-1 text-gray-900 dark:text-white">Contact Information</h3>
            <p className="text-gray-500 dark:text-gray-300 mb-4">Other ways to reach us</p>
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <span className="bg-violet-100 dark:bg-violet-900 rounded-xl p-2"><Mail className="w-6 h-6 text-violet-500 dark:text-violet-400" /></span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">Email Us</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">Send us an email anytime</div>
                  <a href="mailto:support@pdfpulse.com" className="text-violet-600 dark:text-violet-400 text-sm">support@pdfpulse.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-violet-100 dark:bg-violet-900 rounded-xl p-2"><Phone className="w-6 h-6 text-violet-500 dark:text-violet-400" /></span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">Call Us</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">Mon-Fri from 8am to 5pm</div>
                  <a href="tel:+15551234567" className="text-violet-600 dark:text-violet-400 text-sm">+1 (555) 123-4567</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-violet-100 dark:bg-violet-900 rounded-xl p-2"><MapPin className="w-6 h-6 text-violet-500 dark:text-violet-400" /></span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">Visit Us</div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">Come say hello at our office</div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">123 Innovation St, Tech City, TC 12345</div>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Help */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-violet-200 dark:border-gray-800 p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Quick Help</h3>
            <p className="text-gray-500 dark:text-gray-300 mb-3">Common topics and resources</p>
            <div className="flex flex-col gap-3">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900 text-left font-medium text-gray-900 dark:text-gray-100"><HelpCircle className="w-5 h-5 text-violet-500 dark:text-violet-400" /> How to use AI features</button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900 text-left font-medium text-gray-900 dark:text-gray-100"><DollarSign className="w-5 h-5 text-violet-500 dark:text-violet-400" /> Pricing & Plans</button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900 text-left font-medium text-gray-900 dark:text-gray-100"><Bug className="w-5 h-5 text-violet-500 dark:text-violet-400" /> Report a Bug</button>
            </div>
          </div>
        </div>
      </div>
      {/* FAQ Section */}
  <div className="max-w-6xl mx-auto mt-16 bg-white dark:bg-gray-900 rounded-2xl border border-violet-200 dark:border-gray-800 p-10 shadow-sm">
        <div className="flex justify-center mb-8">
          <div className="w-full md:w-auto text-center">
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-300 text-center text-lg">Quick answers to common questions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div>
            <h4 className="text-violet-500 dark:text-violet-400 font-bold text-xl mb-1 text-left">How do AI summaries work?</h4>
            <p className="text-gray-400 dark:text-gray-300 font-normal text-base mb-8 text-left">Our AI analyzes the content of your PDFs and books to extract key concepts, main ideas, and important takeaways, presenting them in digestible summaries.</p>
            <h4 className="text-violet-500 dark:text-violet-400 font-bold text-xl mb-1 text-left">How accurate are the mood-based recommendations?</h4>
            <p className="text-gray-400 dark:text-gray-300 font-normal text-base text-left">Our AI continuously learns from user preferences and feedback to provide increasingly accurate recommendations based on your current emotional state.</p>
          </div>
          <div>
            <h4 className="text-violet-500 dark:text-violet-400 font-bold text-xl mb-1 text-left">Can I upload my own PDFs?</h4>
            <p className="text-gray-400 dark:text-gray-300 font-normal text-base mb-8 text-left">Yes! Premium and Pro users can upload unlimited PDFs for AI analysis and summarization.</p>
            <h4 className="text-violet-500 dark:text-violet-400 font-bold text-xl mb-1 text-left">What file formats are supported?</h4>
            <p className="text-gray-400 dark:text-gray-300 font-normal text-base text-left">We currently support PDF files. We're working on adding support for EPUB, DOCX, and other formats.</p>
          </div>
        </div>
      </div>
      {/* About Section */}
  <div className="max-w-6xl mx-auto mt-16 bg-white dark:bg-gray-900 rounded-2xl border border-violet-200 dark:border-gray-800 p-10 shadow-sm text-center">
  <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">About PDF Pulse</h2>
  <p className="text-gray-600 dark:text-gray-300 text-xl mb-10 max-w-3xl mx-auto">PDF Pulse was founded with the mission to revolutionize how people consume and interact with written content. Our team of AI researchers, developers, and reading enthusiasts work tirelessly to create the most intelligent reading platform in the world.</p>
        <div className="flex flex-col md:flex-row justify-center gap-12">
          <div className="flex flex-col items-center">
            <span className="bg-violet-100 dark:bg-violet-900 rounded-full p-6 mb-3">
              <MessageCircle className="w-10 h-10 text-violet-500 dark:text-violet-400" />
            </span>
            <div className="font-bold text-lg text-gray-900 dark:text-white">AI-Powered</div>
            <div className="text-gray-500 dark:text-gray-300">Cutting-edge AI technology</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-violet-100 dark:bg-violet-900 rounded-full p-6 mb-3">
              <Mail className="w-10 h-10 text-violet-500 dark:text-violet-400" />
            </span>
            <div className="font-bold text-lg text-gray-900 dark:text-white">Reader-Focused</div>
            <div className="text-gray-500 dark:text-gray-300">Built for book lovers</div>
          </div>
          <div className="flex flex-col items-center">
            <span className="bg-violet-100 dark:bg-violet-900 rounded-full p-6 mb-3">
              <Bug className="w-10 h-10 text-violet-500 dark:text-violet-400" />
            </span>
            <div className="font-bold text-lg text-gray-900 dark:text-white">User-Centric</div>
            <div className="text-gray-500 dark:text-gray-300">Your feedback drives us</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
