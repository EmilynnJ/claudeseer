// src/routes/contact/+page.svelte
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
              <label class="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
              <input
                type="text"
                bind:value={formData.personalInfo.firstName}
                required
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
              <input
                type="text"
                bind:value={formData.personalInfo.lastName}
                required
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                bind:value={formData.personalInfo.email}
                required
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
              <input
                type="tel"
                bind:value={formData.personalInfo.phone}
                required
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
              <input
                type="date"
                bind:value={formData.personalInfo.dateOfBirth}
                required
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Location *</label>
              <input
                type="text"
                bind:value={formData.personalInfo.location}
                required
                placeholder="City, State, Country"
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
              />
            </div>
          </div>
        {:else if currentStep === 2}
          <!-- Experience & Qualifications -->
          <h2 class="text-2xl font-playfair text-white mb-6">Experience & Qualifications</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Years of Experience *</label>
              <select bind:value={formData.experience.yearsExperience} required class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg text-white">
                <option value="">Select experience level</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Specialties (Select all that apply) *</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                {#each specialtyOptions as specialty}
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.experience.specialties.includes(specialty)}
                      on:change={() => toggleSpecialty(specialty)}
                      class="rounded border-pink-500/30 bg-purple-900/30 text-pink-500 focus:ring-pink-400"
                    />
                    <span class="text-gray-300 text-sm">{specialty}</span>
                  </label>
                {/each}
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Certifications or Training</label>
              <textarea
                bind:value={formData.experience.certifications}
                rows="3"
                placeholder="List any relevant certifications, courses, or training"
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white resize-none"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Previous Platforms or Experience</label>
              <textarea
                bind:value={formData.experience.previousPlatforms}
                rows="3"
                placeholder="Have you worked on other psychic platforms or provided readings elsewhere?"
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white resize-none"
              ></textarea>
            </div>
          </div>
        {:else if currentStep === 3}
          <!-- Services & Rates -->
          <h2 class="text-2xl font-playfair text-white mb-6">Services & Rates</h2>
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-white mb-4">Services You'll Offer</h3>
              <div class="space-y-4">
                <label class="flex items-center space-x-3">
                  <input type="checkbox" bind:checked={formData.services.offerChat} class="rounded border-pink-500/30 bg-purple-900/30 text-pink-500">
                  <span class="text-gray-300">Chat Readings</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input type="checkbox" bind:checked={formData.services.offerPhone} class="rounded border-pink-500/30 bg-purple-900/30 text-pink-500">
                  <span class="text-gray-300">Phone Readings</span>
                </label>
                <label class="flex items-center space-x-3">
                  <input type="checkbox" bind:checked={formData.services.offerVideo} class="rounded border-pink-500/30 bg-purple-900/30 text-pink-500">
                  <span class="text-gray-300">Video Readings</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-white mb-4">Your Proposed Rates (per minute)</h3>
              <div class="grid md:grid-cols-3 gap-4">
                {#if formData.services.offerChat}
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Chat Rate</label>
                    <div class="relative">
                      <span class="absolute left-3 top-3 text-gray-400">$</span>
                      <input
                        type="number"
                        bind:value={formData.services.chatRate}
                        min="1.99"
                        max="9.99"
                        step="0.10"
                        class="w-full pl-8 pr-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
                      />
                    </div>
                  </div>
                {/if}
                {#if formData.services.offerPhone}
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Phone Rate</label>
                    <div class="relative">
                      <span class="absolute left-3 top-3 text-gray-400">$</span>
                      <input
                        type="number"
                        bind:value={formData.services.phoneRate}
                        min="2.99"
                        max="12.99"
                        step="0.10"
                        class="w-full pl-8 pr-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
                      />
                    </div>
                  </div>
                {/if}
                {#if formData.services.offerVideo}
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Video Rate</label>
                    <div class="relative">
                      <span class="absolute left-3 top-3 text-gray-400">$</span>
                      <input
                        type="number"
                        bind:value={formData.services.videoRate}
                        min="3.99"
                        max="15.99"
                        step="0.10"
                        class="w-full pl-8 pr-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
                      />
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {:else if currentStep === 4}
          <!-- Background & Philosophy -->
          <h2 class="text-2xl font-playfair text-white mb-6">Background & Philosophy</h2>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Tell us about your psychic gifts *</label>
              <textarea
                bind:value={formData.background.psychicGifts}
                required
                rows="4"
                placeholder="Describe your natural abilities and how they manifest..."
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white resize-none"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">How did you discover your abilities? *</label>
              <textarea
                bind:value={formData.background.howDiscovered}
                required
                rows="4"
                placeholder="Share your story of awakening to your psychic gifts..."
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white resize-none"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Describe your reading style *</label>
              <textarea
                bind:value={formData.background.readingStyle}
                required
                rows="4"
                placeholder="How do you conduct readings? What can clients expect from a session with you?"
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white resize-none"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Why do you want to join SoulSeer? *</label>
              <textarea
                bind:value={formData.background.whySoulSeer}
                required
                rows="4"
                placeholder="What attracts you to our platform and community?"
                class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white resize-none"
              ></textarea>
            </div>
          </div>
        {/if}
        
        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8">
          <button
            type="button"
            on:click={prevStep}
            disabled={currentStep === 1}
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {#if currentStep === totalSteps}
            <button
              type="button"
              on:click={submitApplication}
              disabled={$loading}
              class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {$loading ? 'Submitting...' : 'Submit Application'}
            </button>
          {:else}
            <button
              type="button"
              on:click={nextStep}
              class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Next
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

// src/routes/community/+page.svelte
<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import PostCard from '$lib/components/PostCard.svelte';
  import CreatePostModal from '$lib/components/CreatePostModal.svelte';
  
  let posts = writable([]);
  let loading = writable(true);
  let error = writable('');
  let showCreateModal = false;
  
  onMount(async () => {
    try {
      loading.set(true);
      const response = await fetch('/api/posts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        posts.set(data);
      } else {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }
    } catch (err) {
      console.error('Error loading posts:', err);
      error.set('Failed to load community posts. Please try again.');
      posts.set([]);
    } finally {
      loading.set(false);
    }
  });
  
  async function handleCreatePost(event) {
    const newPost = event.detail;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });
      
      if (response.ok) {
        const post = await response.json();
        posts.update(p => [post, ...p]);
        showCreateModal = false;
      } else {
        throw new Error(`Failed to create post: ${response.status}`);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again.');
    }
  }
  
  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="container mx-auto px-4 py-12">
  <div class="flex justify-between items-center mb-12">
    <h1 class="text-5xl font-alex-brush text-pink-400">Community</h1>
    <button
      on:click={() => showCreateModal = true}
      class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors"
    >
      Create Post
    </button>
  </div>
  
  {#if $loading}
    <div class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400"></div>
    </div>
  {:else if $error}
    <div class="text-center py-20">
      <div class="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
        <p class="text-red-400 mb-4">{$error}</p>
        <button 
          on:click={() => window.location.reload()}
          class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  {:else}
    <div class="max-w-2xl mx-auto space-y-6">
      {#each $posts as post}
        <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">{post.author?.charAt(0) || 'U'}</span>
              </div>
              <div>
                <h3 class="text-white font-semibold">{post.author || 'Unknown User'}</h3>
                <p class="text-gray-400 text-sm capitalize">{post.authorRole || 'user'}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">{post.category || 'General'}</span>
              <p class="text-gray-400 text-sm mt-1">{formatDate(post.timestamp)}</p>
            </div>
          </div>
          
          <h2 class="text-xl font-playfair text-white font-semibold mb-3">{post.title}</h2>
          <p class="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
          
          <div class="flex items-center space-x-6 text-gray-400">
            <button class="flex items-center space-x-2 hover:text-pink-400 transition-colors">
              <span>♡</span>
              <span>{post.likes || 0}</span>
            </button>
            <button class="flex items-center space-x-2 hover:text-purple-400 transition-colors">
              <span>💬</span>
              <span>{post.comments || 0}</span>
            </button>
            <button class="hover:text-gold-400 transition-colors">
              <span>↗</span>
            </button>
          </div>
        </div>
      {/each}
      
      {#if $posts.length === 0}
        <div class="text-center py-12">
          <p class="text-gray-400 text-lg">No posts yet. Be the first to share something!</p>
        </div>
      {/if}
    </div>
  {/if}
</div>

{#if showCreateModal}
  <CreatePostModal 
    on:create={handleCreatePost}
    on:close={() => showCreateModal = false}
  />
{/if}

// src/lib/components/CreatePostModal.svelte
<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let formData = {
    title: '',
    content: '',
    category: 'General'
  };
  
  const categories = ['General', 'Spiritual Tips', 'Testimonial', 'Questions', 'Crystal Wisdom', 'Astrology'];
  
  function handleSubmit() {
    if (formData.title.trim() && formData.content.trim()) {
      dispatch('create', formData);
      formData = { title: '', content: '', category: 'General' };
    }
  }
  
  function handleClose() {
    dispatch('close');
  }
</script>

<div class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div class="bg-black/90 backdrop-blur-lg rounded-2xl border border-pink-500/30 w-full max-w-2xl">
    <div class="flex justify-between items-center p-6 border-b border-pink-500/30">
      <h2 class="text-2xl font-playfair text-white">Create New Post</h2>
      <button on:click={handleClose} class="text-gray-400 hover:text-white text-2xl">×</button>
    </div>
    
    <div class="p-6 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
        <select bind:value={formData.category} class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg text-white">
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Title</label>
        <input
          type="text"
          bind:value={formData.title}
          placeholder="What's on your mind?"
          class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Content</label>
        <textarea
          bind:value={formData.content}
          rows="6"
          placeholder="Share your thoughts, experiences, or questions with the community..."
          class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 text-white resize-none"
        ></textarea>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button 
          on:click={handleClose}
          class="px-6 py-3 border border-gray-500/50 text-gray-300 rounded-lg hover:bg-gray-500/10 transition-colors"
        >
          Cancel
        </button>
        <button 
          on:click={handleSubmit}
          disabled={!formData.title.trim() || !formData.content.trim()}
          class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          Post
        </button>
      </div>
    </div>
  </div>
</div><div>
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

// src/routes/apply/+page.svelte
<script>
  import { writable } from 'svelte/store';
  
  let formData = {
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      location: ''
    },
    experience: {
      yearsExperience: '',
      specialties: [],
      certifications: '',
      previousPlatforms: '',
      clientTestimonials: ''
    },
    services: {
      offerChat: false,
      offerPhone: false,
      offerVideo: false,
      chatRate: '',
      phoneRate: '',
      videoRate: ''
    },
    background: {
      psychicGifts: '',
      howDiscovered: '',
      readingStyle: '',
      whySoulSeer: ''
    }
  };
  
  let currentStep = 1;
  let totalSteps = 4;
  let loading = writable(false);
  let submitted = writable(false);
  
  const specialtyOptions = [
    'Tarot', 'Astrology', 'Numerology', 'Crystal Reading', 'Palm Reading',
    'Angel Cards', 'Dream Interpretation', 'Aura Reading', 'Mediumship',
    'Energy Healing', 'Chakra Balancing', 'Love & Relationships'
  ];
  
  function nextStep() {
    if (currentStep < totalSteps) currentStep++;
  }
  
  function prevStep() {
    if (currentStep > 1) currentStep--;
  }
  
  function toggleSpecialty(specialty) {
    const index = formData.experience.specialties.indexOf(specialty);
    if (index > -1) {
      formData.experience.specialties.splice(index, 1);
    } else {
      formData.experience.specialties.push(specialty);
    }
    formData.experience.specialties = [...formData.experience.specialties];
  }
  
  async function submitApplication() {
    loading.set(true);
    
    try {
      const response = await fetch('/api/applications/reader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        submitted.set(true);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Application submission failed' }));
        throw new Error(errorData.message || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      alert(error.message);
    } finally {
      loading.set(false);
    }
  }
</script>

<div class="container mx-auto px-4 py-12">
  <h1 class="text-5xl font-alex-brush text-pink-400 text-center mb-4">Become a SoulSeer Reader</h1>
  <p class="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
    Join our community of gifted psychics and share your talents with seekers around the world. 
    Our readers enjoy a 70/30 revenue split in their favor.
  </p>
  
  {#if $submitted}
    <div class="max-w-2xl mx-auto text-center bg-green-500/20 border border-green-500/50 rounded-2xl p-12">
      <div class="text-6xl mb-6">✨</div>
      <h2 class="text-3xl font-alex-brush text-green-400 mb-4">Application Submitted!</h2>
      <p class="text-green-300 mb-6">
        Thank you for your interest in joining SoulSeer. Our team will review your application 
        and contact you within 5-7 business days.
      </p>
      <a href="/" class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors">
        Return to Home
      </a>
    </div>
  {:else}
    <div class="max-w-3xl mx-auto">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
          <span class="text-sm text-gray-400">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div class="w-full bg-purple-900/30 rounded-full h-2">
          <div class="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
               style="width: {(currentStep / totalSteps) * 100}%"></div>
        </div>
      </div>
      
      <div class="bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-pink-500/30">
        {#if currentStep === 1}
          <!-- Personal Information -->
          <h2 class="text-2xl font-playfair text-white mb-6">Personal Information</h2>
          <div class="grid md:grid-cols-2 gap-6">
            // package.json
{
  "name": "soulseer-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "vite build",
    "dev": "vite dev",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"
  },
  "devDependencies": {
    "@sveltejs/adapter-netlify": "^4.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@types/node": "^20.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  },
  "dependencies": {
    "@clerk/sveltekit": "^2.0.0",
    "@stripe/stripe-js": "^4.0.0",
    "socket.io-client": "^4.7.5"
  },
  "type": "module"
}

// svelte.config.js
import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;

// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': 'http://localhost:8000'
		}
	}
});

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'pink': {
          400: '#FF69B4',
          500: '#FF1493',
          600: '#DC143C'
        },
        'gold': {
          400: '#FFD700',
          500: '#FFA500'
        },
        'purple': {
          800: '#4A148C',
          900: '#2D0A5C'
        }
      },
      fontFamily: {
        'alex-brush': ['Alex Brush', 'cursive'],
        'playfair': ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
}

// src/app.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover" class="bg-black text-white">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>

// src/app.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-pink: #FF69B4;
  --color-gold: #FFD700;
  --color-purple: #8A2BE2;
}

.font-alex-brush {
  font-family: 'Alex Brush', cursive;
}

.font-playfair {
  font-family: 'Playfair Display', serif;
}

.text-gold-400 {
  color: var(--color-gold);
}

.bg-gradient-mystical {
  background: linear-gradient(135deg, #000000 0%, #4A148C 50%, #000000 100%);
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.mystical-border {
  border: 1px solid rgba(255, 105, 180, 0.3);
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.1);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

// src/routes/+layout.svelte
<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { auth, user } from '$lib/stores/auth.js';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  onMount(() => {
    auth.initialize();
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
  {#if $page.route.id !== '/login' && $page.route.id !== '/signup'}
    <Navigation />
  {/if}
  
  <main class="flex-1">
    <slot />
  </main>
  
  {#if $page.route.id !== '/login' && $page.route.id !== '/signup'}
    <Footer />
  {/if}
</div>

// src/routes/+page.svelte
<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Hero from '$lib/components/Hero.svelte';
  import OnlineReaders from '$lib/components/OnlineReaders.svelte';
  import LiveStreams from '$lib/components/LiveStreams.svelte';
  
  let onlineReaders = writable([]);
  let liveStreams = writable([]);
  let loading = writable(true);
  let error = writable('');
  
  onMount(async () => {
    try {
      loading.set(true);
      
      // Fetch online readers from API
      const readersResponse = await fetch('/api/readers/online', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (readersResponse.ok) {
        const readersData = await readersResponse.json();
        onlineReaders.set(readersData);
      } else {
        console.error('Failed to fetch online readers:', readersResponse.status);
        onlineReaders.set([]);
      }
      
      // Fetch live streams from API
      const streamsResponse = await fetch('/api/streams/live', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (streamsResponse.ok) {
        const streamsData = await streamsResponse.json();
        liveStreams.set(streamsData);
      } else {
        console.error('Failed to fetch live streams:', streamsResponse.status);
        liveStreams.set([]);
      }
      
    } catch (err) {
      console.error('Error loading homepage data:', err);
      error.set('Failed to load content. Please refresh the page.');
      onlineReaders.set([]);
      liveStreams.set([]);
    } finally {
      loading.set(false);
    }
  });
</script>

<svelte:head>
  <title>SoulSeer - A Community of Gifted Psychics</title>
</svelte:head>

{#if $loading}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400 mx-auto"></div>
      <p class="text-white mt-4">Loading spiritual guidance...</p>
    </div>
  </div>
{:else}
  <Hero />
  
  {#if $error}
    <div class="container mx-auto px-4 py-8">
      <div class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
        <p class="text-red-400">{$error}</p>
        <button 
          on:click={() => window.location.reload()} 
          class="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  {:else}
    <OnlineReaders readers={$onlineReaders} />
    <LiveStreams streams={$liveStreams} />
  {/if}
{/if}

// src/lib/stores/auth.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const user = writable(null);
export const isAuthenticated = writable(false);
export const loading = writable(true);

export const auth = {
  initialize: async () => {
    if (!browser) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          user.set(userData.user);
          isAuthenticated.set(true);
        } else {
          localStorage.removeItem('authToken');
          user.set(null);
          isAuthenticated.set(false);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('authToken');
      user.set(null);
      isAuthenticated.set(false);
    } finally {
      loading.set(false);
    }
  },

  signIn: async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    user.set(data.user);
    isAuthenticated.set(true);
    return data;
  },

  signUp: async (userData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    user.set(data.user);
    isAuthenticated.set(true);
    return data;
  },

  signOut: async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    localStorage.removeItem('authToken');
    user.set(null);
    isAuthenticated.set(false);
  }
};

// src/lib/stores/cart.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createCart() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    addItem: (item) => update(cart => {
      const existingItem = cart.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
        return cart;
      } else {
        return [...cart, { ...item, quantity: 1 }];
      }
    }),
    removeItem: (id) => update(cart => cart.filter(item => item.id !== id)),
    updateQuantity: (id, quantity) => update(cart => 
      cart.map(item => item.id === id ? { ...item, quantity } : item)
    ),
    clear: () => set([]),
    load: () => {
      if (browser) {
        const saved = localStorage.getItem('cart');
        if (saved) {
          set(JSON.parse(saved));
        }
      }
    }
  };
}

export const cart = createCart();

// src/lib/components/Navigation.svelte
<script>
  import { page } from '$app/stores';
  import { user, isAuthenticated, auth } from '$lib/stores/auth.js';
  import { cart } from '$lib/stores/cart.js';
  
  let mobileMenuOpen = false;
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/readings', label: 'Readings' },
    { href: '/live', label: 'Live' },
    { href: '/shop', label: 'Shop' },
    { href: '/community', label: 'Community' }
  ];
  
  function handleSignOut() {
    auth.signOut();
    mobileMenuOpen = false;
  }
</script>

<nav class="bg-black/80 backdrop-blur-lg border-b border-pink-500/30 sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      <a href="/" class="text-3xl font-alex-brush text-pink-400 hover:text-pink-300 transition-colors">
        SoulSeer
      </a>
      
      <div class="hidden md:flex items-center space-x-8">
        {#each navItems as item}
          <a 
            href={item.href}
            class="text-white hover:text-pink-400 transition-colors font-playfair {$page.url.pathname === item.href ? 'text-pink-400 border-b border-pink-400' : ''}"
          >
            {item.label}
          </a>
        {/each}
      </div>
      
      <div class="hidden md:flex items-center space-x-4">
        {#if $isAuthenticated}
          <a href="/messages" class="text-white hover:text-pink-400 transition-colors">
            Messages
          </a>
          <a href="/cart" class="text-white hover:text-pink-400 transition-colors flex items-center space-x-1">
            <span>🛒</span>
            {#if $cart.length > 0}
              <span class="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {$cart.length}
              </span>
            {/if}
          </a>
          <a href="/dashboard" class="text-white hover:text-pink-400 transition-colors">
            Dashboard
          </a>
          <button 
            on:click={handleSignOut}
            class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        {:else}
          <a href="/login" class="text-white hover:text-pink-400 transition-colors">
            Sign In
          </a>
          <a href="/signup" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors">
            Sign Up
          </a>
        {/if}
      </div>
      
      <button 
        class="md:hidden text-white"
        on:click={() => mobileMenuOpen = !mobileMenuOpen}
      >
        ☰
      </button>
    </div>
    
    {#if mobileMenuOpen}
      <div class="md:hidden border-t border-pink-500/30 py-4">
        {#each navItems as item}
          <a 
            href={item.href}
            class="block py-2 text-white hover:text-pink-400 transition-colors {$page.url.pathname === item.href ? 'text-pink-400' : ''}"
            on:click={() => mobileMenuOpen = false}
          >
            {item.label}
          </a>
        {/each}
        
        {#if $isAuthenticated}
          <a href="/dashboard" class="block py-2 text-white hover:text-pink-400 transition-colors">
            Dashboard
          </a>
          <button 
            on:click={handleSignOut}
            class="block w-full text-left py-2 text-white hover:text-pink-400 transition-colors"
          >
            Sign Out
          </button>
        {:else}
          <a href="/login" class="block py-2 text-white hover:text-pink-400 transition-colors">
            Sign In
          </a>
          <a href="/signup" class="block py-2 text-white hover:text-pink-400 transition-colors">
            Sign Up
          </a>
        {/if}
      </div>
    {/if}
  </div>
</nav>

// src/lib/components/Hero.svelte
<script>
  import { onMount } from 'svelte';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <div 
    class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
    style="background-image: url('https://i.postimg.cc/sXdsKGTK/DALL-E-2025-06-06-14-36-29-A-vivid-ethereal-background-image-designed-for-a-psychic-reading-app.webp')"
  ></div>
  
  <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
  
  <div class="relative z-10 text-center max-w-4xl mx-auto px-4">
    <h1 class="text-7xl md:text-9xl font-alex-brush text-pink-400 mb-8 animate-float">
      SoulSeer
    </h1>
    
    <div class="mb-8">
      <img 
        src="https://i.postimg.cc/tRLSgCPb/HERO-IMAGE-1.jpg" 
        alt="Mystical Hero" 
        class="mx-auto rounded-2xl shadow-2xl border border-pink-500/30 max-w-md animate-pulse-slow"
      />
    </div>
    
    <h2 class="text-3xl md:text-5xl font-playfair text-white mb-12">
      A Community of Gifted Psychics
    </h2>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a 
        href="/readings" 
        class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
      >
        Get a Reading Now
      </a>
      <a 
        href="/live" 
        class="border-2 border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
      >
        Watch Live Streams
      </a>
    </div>
  </div>
  
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <svg class="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  </div>
</section>

// src/lib/components/OnlineReaders.svelte
<script>
  export let readers = [];
</script>

<section class="py-20 bg-gradient-to-b from-transparent to-purple-900/30">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-alex-brush text-pink-400 text-center mb-12">
      Readers Online Now
    </h2>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each readers as reader}
        <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-playfair text-white font-semibold">{reader.name}</h3>
            <div class="flex items-center space-x-1">
              <span class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <span class="text-green-400 text-sm">Online</span>
            </div>
          </div>
          
          <p class="text-gray-300 mb-4">{reader.specialty}</p>
          
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <span class="text-yellow-400">★★★★★</span>
              <span class="text-gray-300 ml-2">({reader.rating})</span>
            </div>
            <span class="text-pink-400 font-semibold">${reader.rate}/min</span>
          </div>
          
          <button class="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg transition-colors">
            Start Reading
          </button>
        </div>
      {/each}
    </div>
  </div>
</section>

// src/lib/components/LiveStreams.svelte
<script>
  export let streams = [];
</script>

<section class="py-20">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-alex-brush text-pink-400 text-center mb-12">
      Live Streams
    </h2>
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each streams as stream}
        <div class="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 overflow-hidden hover:border-pink-500/60 transition-all duration-300 transform hover:scale-105">
          <div class="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center relative">
            <div class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
              <span class="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              LIVE
            </div>
            <div class="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {stream.viewers} viewers
            </div>
            <svg class="w-20 h-20 text-white/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          
          <div class="p-6">
            <h3 class="text-xl font-playfair text-white font-semibold mb-2">{stream.title}</h3>
            <p class="text-gray-300 mb-4">with {stream.reader}</p>
            
            <button class="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-300">
              Join Stream
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

// src/lib/components/Footer.svelte
<footer class="bg-black border-t border-pink-500/30 py-12">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-4 gap-8">
      <div>
        <h3 class="text-2xl font-alex-brush text-pink-400 mb-4">SoulSeer</h3>
        <p class="text-gray-300 text-sm">A community of gifted psychics providing ethical, compassionate spiritual guidance.</p>
      </div>
      
      <div>
        <h4 class="text-white font-semibold mb-4">Services</h4>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li><a href="/readings" class="hover:text-pink-400 transition-colors">Readings</a></li>
          <li><a href="/live" class="hover:text-pink-400 transition-colors">Live Streams</a></li>
          <li><a href="/shop" class="hover:text-pink-400 transition-colors">Shop</a></li>
        </ul>
      </div>
      
      <div>
        <h4 class="text-white font-semibold mb-4">Community</h4>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li><a href="/community" class="hover:text-pink-400 transition-colors">Forum</a></li>
          <li><a href="/about" class="hover:text-pink-400 transition-colors">About</a></li>
          <li><a href="/apply" class="hover:text-pink-400 transition-colors">Become a Reader</a></li>
        </ul>
      </div>
      
      <div>
        <h4 class="text-white font-semibold mb-4">Support</h4>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li><a href="/help" class="hover:text-pink-400 transition-colors">Help Center</a></li>
          <li><a href="/faq" class="hover:text-pink-400 transition-colors">FAQ</a></li>
          <li><a href="/contact" class="hover:text-pink-400 transition-colors">Contact</a></li>
        </ul>
      </div>
    </div>
    
    <div class="border-t border-pink-500/30 mt-8 pt-8 text-center text-gray-400 text-sm">
      <p>&copy; 2024 SoulSeer. All rights reserved.</p>
    </div>
  </div>
</footer>

// netlify.toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"

// .gitignore
.DS_Store
node_modules
/build
/.svelte-kit
/package
.env
.env.*
!.env.example

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# Netlify
.netlify

// src/routes/login/+page.svelte
<script>
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth.js';
  import { writable } from 'svelte/store';
  
  let email = '';
  let password = '';
  let loading = writable(false);
  let error = writable('');
  
  async function handleLogin() {
    loading.set(true);
    error.set('');
    
    try {
      await auth.signIn(email, password);
      goto('/dashboard');
    } catch (err) {
      error.set(err.message);
    } finally {
      loading.set(false);
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black">
  <div class="bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-pink-500/30 w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-alex-brush text-pink-400 mb-2">SoulSeer</h1>
      <p class="text-gray-300">Welcome back to your spiritual journey</p>
    </div>
    
    <form on:submit|preventDefault={handleLogin} class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <input
          type="email"
          bind:value={email}
          required
          class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter your email"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <input
          type="password"
          bind:value={password}
          required
          class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter your password"
        />
      </div>
      
      {#if $error}
        <div class="text-red-400 text-sm text-center">{$error}</div>
      {/if}
      
      <button
        type="submit"
        disabled={$loading}
        class="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
      >
        {$loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
    
    <div class="mt-6 text-center">
      <a href="/signup" class="text-pink-400 hover:text-pink-300 transition-colors">
        Don't have an account? Sign up
      </a>
    </div>
  </div>
</div>

// src/routes/signup/+page.svelte
<script>
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth.js';
  import { writable } from 'svelte/store';
  
  let formData = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  };
  let loading = writable(false);
  let error = writable('');
  
  async function handleSignup() {
    if (formData.password !== formData.confirmPassword) {
      error.set('Passwords do not match');
      return;
    }
    
    loading.set(true);
    error.set('');
    
    try {
      await auth.signUp(formData);
      goto('/dashboard');
    } catch (err) {
      error.set(err.message);
    } finally {
      loading.set(false);
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black py-12">
  <div class="bg-black/50 backdrop-blur-lg p-8 rounded-2xl border border-pink-500/30 w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-alex-brush text-pink-400 mb-2">SoulSeer</h1>
      <p class="text-gray-300">Join our community of seekers</p>
    </div>
    
    <form on:submit|preventDefault={handleSignup} class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">First Name</label>
          <input
            type="text"
            bind:value={formData.firstName}
            required
            class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
          <input
            type="text"
            bind:value={formData.lastName}
            required
            class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
          />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <input
          type="email"
          bind:value={formData.email}
          required
          class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Phone</label>
        <input
          type="tel"
          bind:value={formData.phone}
          class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <input
          type="password"
          bind:value={formData.password}
          required
          class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
        <input
          type="password"
          bind:value={formData.confirmPassword}
          required
          class="w-full px-4 py-3 bg-purple-900/30 border border-pink-500/30 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent text-white placeholder-gray-400"
        />
      </div>
      
      {#if $error}
        <div class="text-red-400 text-sm text-center">{$error}</div>
      {/if}
      
      <button
        type="submit"
        disabled={$loading}
        class="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
      >
        {$loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
    
    <div class="mt-6 text-center">
      <a href="/login" class="text-pink-400 hover:text-pink-300 transition-colors">
        Already have an account? Sign in
      </a>
    </div>
  </div>
</div>

// src/routes/about/+page.svelte
<div class="container mx-auto px-4 py-12">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-5xl font-alex-brush text-pink-400 text-center mb-8">About SoulSeer</h1>
    
    <div class="grid md:grid-cols-2 gap-12 items-center mb-16">
      <div>
        <img 
          src="https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg" 
          alt="Founder Emilynn" 
          class="rounded-2xl shadow-2xl border border-pink-500/30"
        />
      </div>
      <div class="space-y-6">
        <h2 class="text-3xl font-playfair text-gold-400">Our Mission</h2>
        <p class="text-gray-300 leading-relaxed">
          At SoulSeer, we are dedicated to providing ethical, compassionate, and judgment-free spiritual guidance. Our mission is twofold: to offer clients genuine, heart-centered readings and to uphold fair, ethical standards for our readers.
        </p>
        <p class="text-gray-300 leading-relaxed">
          Founded by psychic medium Emilynn, SoulSeer was created as a response to the corporate greed that dominates many psychic platforms. Unlike other apps, our readers keep the majority of what they earn and play an active role in shaping the platform.
        </p>
      </div>
    </div>
    
    <div class="text-center bg-purple-900/30 p-8 rounded-2xl border border-pink-500/30">
      <h3 class="text-2xl font-alex-brush text-pink-400 mb-4">A Soul Tribe</h3>
      <p class="text-gray-300 leading-relaxed max-w-3xl mx-auto">
        SoulSeer is more than just an app—it's a soul tribe. A community of gifted psychics united by our life's calling: to guide, heal, and empower those who seek clarity on their journey.
      </p>
    </div>
  </div>
</div>

// src/routes/dashboard/+page.svelte
<script>
  import { user, isAuthenticated } from '$lib/stores/auth.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import ClientDashboard from '$lib/components/dashboard/ClientDashboard.svelte';
  import ReaderDashboard from '$lib/components/dashboard/ReaderDashboard.svelte';
  import AdminDashboard from '$lib/components/dashboard/AdminDashboard.svelte';
  
  onMount(() => {
    if (!$isAuthenticated) {
      goto('/login');
    }
  });
</script>

{#if $user}
  {#if $user.role === 'admin'}
    <AdminDashboard />
  {:else if $user.role === 'reader'}
    <ReaderDashboard />
  {:else}
    <ClientDashboard />
  {/if}
{/if}

// src/routes/readings/+page.svelte
<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import ReaderCard from '$lib/components/ReaderCard.svelte';
  
  let readers = writable([]);
  let filteredReaders = writable([]);
  let filters = {
    availability: 'all',
    specialty: 'all',
    priceRange: 'all',
    rating: 'all'
  };
  
  onMount(async () => {
    // Mock data for demo
    const mockReaders = [
      { id: 1, name: "Mystic Luna", specialty: "Tarot", rating: 4.9, rate: 4.99, status: "online", image: "/reader1.jpg" },
      { id: 2, name: "Oracle Sage", specialty: "Astrology", rating: 4.8, rate: 3.99, status: "online", image: "/reader2.jpg" },
      { id: 3, name: "Crystal Visions", specialty: "Crystal Reading", rating: 4.7, rate: 5.99, status: "busy", image: "/reader3.jpg" },
      { id: 4, name: "Cosmic Angel", specialty: "Angel Cards", rating: 4.9, rate: 6.99, status: "offline", image: "/reader4.jpg" },
      { id: 5, name: "Star Whisperer", specialty: "Numerology", rating: 4.6, rate: 3.49, status: "online", image: "/reader5.jpg" }
    ];
    readers.set(mockReaders);
    filteredReaders.set(mockReaders);
  });
  
  function applyFilters() {
    const filtered = $readers.filter(reader => {
      if (filters.availability !== 'all' && reader.status !== filters.availability) return false;
      if (filters.specialty !== 'all' && reader.specialty !== filters.specialty) return false;
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (reader.rate < min || reader.rate > max) return false;
      }
      if (filters.rating !== 'all' && reader.rating < Number(filters.rating)) return false;
      return true;
    });
    filteredReaders.set(filtered);
  }
</script>

<div class="container mx-auto px-4 py-12">
  <h1 class="text-5xl font-alex-brush text-pink-400 text-center mb-12">Find Your Reader</h1>
  
  <div class="grid lg:grid-cols-4 gap-8">
    <!-- Filters -->
    <div class="lg:col-span-1">
      <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
        <h2 class="text-2xl font-playfair text-white mb-6">Filters</h2>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Availability</label>
            <select bind:value={filters.availability} on:change={applyFilters} class="w-full bg-purple-900/30 border border-pink-500/30 rounded-lg px-3 py-2 text-white">
              <option value="all">All</option>
              <option value="online">Online</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Specialty</label>
            <select bind:value={filters.specialty} on:change={applyFilters} class="w-full bg-purple-900/30 border border-pink-500/30 rounded-lg px-3 py-2 text-white">
              <option value="all">All Specialties</option>
              <option value="Tarot">Tarot</option>
              <option value="Astrology">Astrology</option>
              <option value="Crystal Reading">Crystal Reading</option>
              <option value="Angel Cards">Angel Cards</option>
              <option value="Numerology">Numerology</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
            <select bind:value={filters.priceRange} on:change={applyFilters} class="w-full bg-purple-900/30 border border-pink-500/30 rounded-lg px-3 py-2 text-white">
              <option value="all">All Prices</option>
              <option value="0-4">$0 - $4/min</option>
              <option value="4-6">$4 - $6/min</option>
              <option value="6-10">$6+ /min</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Minimum Rating</label>
            <select bind:value={filters.rating} on:change={applyFilters} class="w-full bg-purple-900/30 border border-pink-500/30 rounded-lg px-3 py-2 text-white">
              <option value="all">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.7">4.7+ Stars</option>
              <option value="4.9">4.9+ Stars</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Readers Grid -->
    <div class="lg:col-span-3">
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {#each $filteredReaders as reader}
          <ReaderCard {reader} />
        {/each}
      </div>
      
      {#if $filteredReaders.length === 0}
        <div class="text-center py-12">
          <p class="text-gray-

// src/lib/components/dashboard/ClientDashboard.svelte
<script>
  import { user } from '$lib/stores/auth.js';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  let balance = writable(0);
  let sessions = writable([]);
  let favorites = writable([]);
  let upcoming = writable([]);
  let loading = writable(true);
  let error = writable('');
  
  onMount(async () => {
    try {
      loading.set(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Fetch account balance
      const balanceResponse = await fetch('/api/users/balance', { headers });
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        balance.set(balanceData.balance);
      }
      
      // Fetch recent sessions
      const sessionsResponse = await fetch('/api/users/sessions', { headers });
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        sessions.set(sessionsData);
      }
      
      // Fetch favorite readers
      const favoritesResponse = await fetch('/api/users/favorites', { headers });
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json();
        favorites.set(favoritesData);
      }
      
      // Fetch upcoming sessions
      const upcomingResponse = await fetch('/api/users/upcoming', { headers });
      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        upcoming.set(upcomingData);
      }
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      error.set('Failed to load dashboard data. Please refresh the page.');
    } finally {
      loading.set(false);
    }
  });
  
  async function handleAddFunds() {
    // This would open a Stripe checkout session
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'add_funds' })
      });
      
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      alert('Failed to open payment page. Please try again.');
    }
  }
</script>

<div class="container mx-auto px-4 py-12">
  {#if $loading}
    <div class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400"></div>
    </div>
  {:else if $error}
    <div class="text-center py-20">
      <div class="bg-red-500/20 border border-red-500/50 rounded-lg p-6 max-w-md mx-auto">
        <p class="text-red-400 mb-4">{$error}</p>
        <button 
          on:click={() => window.location.reload()}
          class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  {:else}
    <h1 class="text-4xl font-alex-brush text-pink-400 mb-8">Welcome back, {$user?.name || 'User'}!</h1>
    
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-6 rounded-2xl border border-pink-500/30">
        <h2 class="text-2xl font-playfair text-white mb-4">Account Balance</h2>
        <div class="text-4xl font-bold text-pink-400 mb-4">${$balance.toFixed(2)}</div>
        <div class="space-y-2">
          <button 
            on:click={handleAddFunds}
            class="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition-colors"
          >
            Add Funds
          </button>
          <button class="w-full border border-pink-500/50 text-pink-400 hover:bg-pink-500/10 py-2 rounded-lg transition-colors">
            Auto-Reload Settings
          </button>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
        <h2 class="text-2xl font-playfair text-white mb-4">Quick Actions</h2>
        <div class="space-y-3">
          <a href="/readings" class="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-center transition-colors">
            Get a Reading
          </a>
          <a href="/live" class="block w-full border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 py-3 rounded-lg text-center transition-colors">
            Watch Live Streams
          </a>
          <a href="/shop" class="block w-full border border-gold-400/50 text-gold-400 hover:bg-gold-400/10 py-3 rounded-lg text-center transition-colors">
            Browse Shop
          </a>
        </div>
      </div>
      
      <!-- Upcoming Sessions -->
      <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
        <h2 class="text-2xl font-playfair text-white mb-4">Upcoming Sessions</h2>
        {#if $upcoming.length > 0}
          {#each $upcoming as session}
            <div class="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30 mb-3">
              <div class="font-semibold text-white">{session.reader}</div>
              <div class="text-gray-300 text-sm">{new Date(session.scheduledTime).toLocaleDateString()} at {new Date(session.scheduledTime).toLocaleTimeString()}</div>
              <div class="text-purple-400 text-sm">{session.type} Reading</div>
            </div>
          {/each}
        {:else}
          <p class="text-gray-400">No upcoming sessions</p>
        {/if}
      </div>
    </div>
    
    <!-- Recent Sessions -->
    <div class="mt-12">
      <h2 class="text-3xl font-playfair text-white mb-6">Recent Sessions</h2>
      <div class="bg-black/40 backdrop-blur-lg rounded-2xl border border-pink-500/30 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-pink-500/20">
              <tr>
                <th class="px-6 py-4 text-left text-white">Reader</th>
                <th class="px-6 py-4 text-left text-white">Type</th>
                <th class="px-6 py-4 text-left text-white">Duration</th>
                <th class="px-6 py-4 text-left text-white">Cost</th>
                <th class="px-6 py-4 text-left text-white">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-pink-500/30">
              {#each $sessions as session}
                <tr class="hover:bg-purple-900/20 transition-colors">
                  <td class="px-6 py-4 text-white">{session.readerName}</td>
                  <td class="px-6 py-4 text-gray-300">{session.type}</td>
                  <td class="px-6 py-4 text-gray-300">{session.duration} min</td>
                  <td class="px-6 py-4 text-pink-400">${session.totalCost}</td>
                  <td class="px-6 py-4 text-gray-300">{new Date(session.endTime).toLocaleDateString()}</td>
                </tr>
              {/each}
            </tbody>
          </table>
          {#if $sessions.length === 0}
            <div class="p-6 text-center text-gray-400">
              No recent sessions found.
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Favorite Readers -->
    <div class="mt-12">
      <h2 class="text-3xl font-playfair text-white mb-6">Favorite Readers</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $favorites as reader}
          <div class="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border border-pink-500/30">
            <h3 class="text-xl font-semibold text-white mb-2">{reader.name}</h3>
            <p class="text-gray-300 mb-4">{reader.specialty}</p>
            <button class="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition-colors">
              Start Reading
            </button>
          </div>
        {/each}
        {#if $favorites.length === 0}
          <div class="col-span-full text-center py-8">
            <p class="text-gray-400">No favorite readers yet. Start browsing to find your perfect reader!</p>
            <a href="/readings" class="mt-4 inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors">
              Browse Readers
            </a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

// README.md
# SoulSeer - Mystical Psychic Reading Platform

A comprehensive psychic reading platform built with SvelteKit and deployed on Netlify.

## Features

🔮 **Pay-per-minute readings** (chat, voice, video)  
📅 **Scheduled flat-rate readings**  
🎥 **Live streaming with virtual gifting**  
💰 **Stripe Connect payments** (70/30 split)  
🎨 **Mystical UI** with dark theme  
📱 **Mobile responsive** design  
🔒 **Secure authentication**  
💬 **Real-time messaging**  
🛒 **Marketplace** for services & products  
👥 **Community forum**  
📊 **Comprehensive dashboards**  

## Tech Stack

- **Frontend:** SvelteKit + TailwindCSS
- **Deployment:** Netlify
- **Authentication:** Clerk
- **Payments:** Stripe Connect
- **Real-time:** WebSockets
- **Database:** Neon PostgreSQL

## Quick Start

```bash
npm install
npm run dev
```

## Deployment

Deployed automatically via Netlify on every push to main branch.

## Live Demo

Visit: https://soulseerapp.netlify.app

## Development Status

✅ Core infrastructure and routing  
✅ Authentication system  
✅ Basic UI components and pages  
✅ Responsive design  
✅ Login/Signup pages
✅ Client dashboard  
⏳ Complete WebRTC implementation  
⏳ Payment processing  
⏳ Admin dashboard  
⏳ All remaining features per build guide  

## License

Private - All rights reserved