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
          <p class="text-gray-400 text-lg">No readers found matching your criteria.</p>
        </div>
      {/if}
    </div>
  </div>
</div>
