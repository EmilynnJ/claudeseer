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
