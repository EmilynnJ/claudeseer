<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import LiveStreamCard from '$lib/components/LiveStreamCard.svelte';
  
  let liveStreams = writable([]);
  let scheduledStreams = writable([]);
  let loading = writable(true);
  let error = writable('');
  
  onMount(async () => {
    try {
      loading.set(true);
      
      const [liveResponse, scheduledResponse] = await Promise.all([
        fetch('/api/streams/live'),
        fetch('/api/streams/scheduled')
      ]);
      
      if (liveResponse.ok) {
        const liveData = await liveResponse.json();
        liveStreams.set(liveData);
      }
      
      if (scheduledResponse.ok) {
        const scheduledData = await scheduledResponse.json();
        scheduledStreams.set(scheduledData);
      }
      
    } catch (err) {
      console.error('Error loading streams:', err);
      error.set('Failed to load streams. Please refresh the page.');
    } finally {
      loading.set(false);
    }
  });
</script>

<div class="container mx-auto px-4 py-12">
  <h1 class="text-5xl font-alex-brush text-pink-400 text-center mb-12">Live Streams</h1>
  
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
    <!-- Live Streams -->
    <section class="mb-16">
      <h2 class="text-3xl font-playfair text-white mb-8">Live Now</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $liveStreams as stream}
          <LiveStreamCard {stream} />
        {/each}
        {#if $liveStreams.length === 0}
          <div class="col-span-full text-center py-12">
            <p class="text-gray-400 text-lg">No live streams at the moment. Check back later!</p>
          </div>
        {/if}
      </div>
    </section>
    
    <!-- Scheduled Streams -->
    <section>
      <h2 class="text-3xl font-playfair text-white mb-8">Upcoming Streams</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $scheduledStreams as stream}
          <LiveStreamCard {stream} isScheduled={true} />
        {/each}
        {#if $scheduledStreams.length === 0}
          <div class="col-span-full text-center py-12">
            <p class="text-gray-400 text-lg">No scheduled streams. Check back later!</p>
          </div>
        {/if}
      </div>
    </section>
  {/if}
</div>
