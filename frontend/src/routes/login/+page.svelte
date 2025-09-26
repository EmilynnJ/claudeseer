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
