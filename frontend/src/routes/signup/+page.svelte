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
