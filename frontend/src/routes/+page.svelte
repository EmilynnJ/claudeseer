<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Hero from '$lib/components/common/Hero.svelte';
  import OnlineReaders from '$lib/components/common/OnlineReaders.svelte';
  import LiveStreams from '$lib/components/common/LiveStreams.svelte';
  
  let onlineReaders = writable([]);
  let liveStreams = writable([]);
  let loading = writable(true);
  let error = writable('');
  
  onMount(async () => {
    try {
      loading.set(true);
      
      const [readersResponse, streamsResponse] = await Promise.all([
        fetch('/api/readings/online'),
        fetch('/api/streams/live')
      ]);
      
      if (readersResponse.ok) {
        const readersData = await readersResponse.json();
        onlineReaders.set(readersData);
      }
      
      if (streamsResponse.ok) {
        const streamsData = await streamsResponse.json();
        liveStreams.set(streamsData);
      }
      
    } catch (err) {
      console.error('Error loading homepage data:', err);
      error.set('Failed to load content. Please refresh the page.');
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
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400"></div>
  </div>
{:else}
  <Hero />
  <OnlineReaders readers={$onlineReaders} />
  <LiveStreams streams={$liveStreams} />
{/if}
