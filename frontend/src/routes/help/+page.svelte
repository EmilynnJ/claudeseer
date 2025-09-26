<script>
  import { writable } from 'svelte/store';
  
  let searchQuery = '';
  let selectedCategory = 'all';
  let faqs = writable([
    {
      id: 1,
      category: 'general',
      question: 'How do I get started with SoulSeer?',
      answer: 'Simply create an account, add funds to your balance, and browse our available readers to start your first reading session.'
    },
    {
      id: 2,
      category: 'billing',
      question: 'How does the payment system work?',
      answer: 'SoulSeer uses a prepaid balance system. You add funds to your account, and readings are charged per minute from your balance.'
    },
    {
      id: 3,
      category: 'technical',
      question: 'What if I have technical issues during a reading?',
      answer: 'If you experience technical difficulties, the session will be paused and you can reconnect. You will only be charged for the time you were actually connected.'
    },
    {
      id: 4,
      category: 'general',
      question: 'How do I become a reader?',
      answer: 'Visit our Apply page to submit an application. Our team reviews all applications and will contact you within 5-7 business days.'
    },
    {
      id: 5,
      category: 'billing',
      question: 'What is the revenue split for readers?',
      answer: 'Readers receive 70% of the revenue from their sessions, with SoulSeer keeping 30% for platform maintenance and development.'
    }
  ]);
  
  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'general', label: 'General' },
    { value: 'billing', label: 'Billing' },
    { value: 'technical', label: 'Technical' },
    { value: 'readers', label: 'For Readers' }
  ];
  
  function filterFAQs() {
    let filtered = $faqs;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }
  
  $: filteredFAQs = filterFAQs();
</script>

<div class="container mx-auto px-4 py-12">
  <h1 class="text-5xl font-alex-brush text-pink-400 text-center mb-12">Help Center</h1>
  
  <!-- Search and Filter -->
  <div class="max-w-4xl mx-auto mb-12">
    <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="flex-1">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search for help topics..."
            class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-400"
          />
        </div>
        <div class="md:w-48">
          <select 
            bind:value={selectedCategory}
            class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg text-white"
          >
            {#each categories as category}
              <option value={category.value}>{category.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>
  
  <!-- FAQ Section -->
  <div class="max-w-4xl mx-auto">
    <h2 class="text-3xl font-playfair text-white mb-8">Frequently Asked Questions</h2>
    
    <div class="space-y-4">
      {#each filteredFAQs as faq}
        <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
          <h3 class="text-xl font-playfair text-white font-semibold mb-3">{faq.question}</h3>
          <p class="text-gray-300 leading-relaxed">{faq.answer}</p>
        </div>
      {/each}
      
      {#if filteredFAQs.length === 0}
        <div class="text-center py-12">
          <p class="text-gray-400 text-lg">No FAQs found matching your search criteria.</p>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Contact Support -->
  <div class="max-w-4xl mx-auto mt-16">
    <div class="bg-gradient-to-r from-pink-500/20 to-purple-600/20 p-8 rounded-2xl border border-pink-500/30 text-center">
      <h3 class="text-2xl font-playfair text-white mb-4">Still Need Help?</h3>
      <p class="text-gray-300 mb-6">Our support team is here to help you with any questions or issues.</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/contact" class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg transition-colors">
          Contact Support
        </a>
        <a href="/community" class="border border-pink-500/50 text-pink-400 hover:bg-pink-500/10 px-8 py-3 rounded-lg transition-colors">
          Ask Community
        </a>
      </div>
    </div>
  </div>
</div>
