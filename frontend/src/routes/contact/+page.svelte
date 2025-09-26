<script>
  import { writable } from 'svelte/store';
  
  let formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  };
  
  let loading = writable(false);
  let success = writable(false);
  let error = writable('');
  
  async function handleSubmit() {
    loading.set(true);
    error.set('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        success.set(true);
        formData = { name: '', email: '', subject: '', message: '', category: 'general' };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to send message' }));
        error.set(errorData.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      error.set('Failed to send message. Please check your connection and try again.');
    } finally {
      loading.set(false);
    }
  }
</script>

<div class="container mx-auto px-4 py-12">
  <h1 class="text-5xl font-alex-brush text-pink-400 text-center mb-12">Contact Us</h1>
  
  <div class="max-w-2xl mx-auto">
    {#if $success}
      <div class="bg-green-500/20 border border-green-500/50 rounded-lg p-6 mb-8 text-center">
        <h2 class="text-2xl text-green-400 font-semibold mb-2">Message Sent!</h2>
        <p class="text-green-300">Thank you for contacting us. We'll get back to you within 24 hours.</p>
        <button 
          on:click={() => success.set(false)}
          class="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Send Another Message
        </button>
      </div>
    {:else}
      <div class="bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-pink-500/30">
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                bind:value={formData.name}
                required
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                bind:value={formData.email}
                required
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select 
              bind:value={formData.category}
              class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
            >
              <option value="general">General Inquiry</option>
              <option value="technical">Technical Support</option>
              <option value="billing">Billing Question</option>
              <option value="reader">Reader Application</option>
              <option value="complaint">Complaint/Dispute</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
            <input
              type="text"
              bind:value={formData.subject}
              required
              class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
              placeholder="Brief description of your inquiry"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Message *</label>
            <textarea
              bind:value={formData.message}
              required
              rows="5"
              class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400 resize-none"
              placeholder="Please provide details about your inquiry..."
            ></textarea>
          </div>
          
          {#if $error}
            <div class="text-red-400 text-sm text-center">{$error}</div>
          {/if}
          
          <button
            type="submit"
            disabled={$loading}
            class="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {$loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    {/if}
    
    <!-- Contact Info -->
    <div class="mt-12 grid md:grid-cols-3 gap-6 text-center">
      <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
        <div class="text-3xl mb-4">📧</div>
        <h3 class="text-white font-semibold mb-2">Email</h3>
        <p class="text-gray-300 text-sm">support@soulseer.com</p>
      </div>
      <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
        <div class="text-3xl mb-4">💬</div>
        <h3 class="text-white font-semibold mb-2">Live Chat</h3>
        <p class="text-gray-300 text-sm">Available 24/7</p>
      </div>
      <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
        <div class="text-3xl mb-4">⏰</div>
        <h3 class="text-white font-semibold mb-2">Response Time</h3>
        <p class="text-gray-300 text-sm">Within 24 hours</p>
      </div>
    </div>
  </div>
</div>
