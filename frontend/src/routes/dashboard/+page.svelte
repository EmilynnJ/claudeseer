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
