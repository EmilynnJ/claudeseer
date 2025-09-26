<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth.js';
  import Navigation from '$lib/components/common/Navigation.svelte';
  import Footer from '$lib/components/common/Footer.svelte';
  
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
