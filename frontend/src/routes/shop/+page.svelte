<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import ProductCard from '$lib/components/ProductCard.svelte';
  
  let products = writable([]);
  let loading = writable(true);
  let error = writable('');
  let selectedCategory = 'all';
  
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'service', label: 'Services' },
    { value: 'digital', label: 'Digital Products' },
    { value: 'physical', label: 'Physical Products' }
  ];
  
  onMount(async () => {
    try {
      loading.set(true);
      
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        products.set(data);
      } else {
        throw new Error('Failed to load products');
      }
      
    } catch (err) {
      console.error('Error loading products:', err);
      error.set('Failed to load products. Please refresh the page.');
    } finally {
      loading.set(false);
    }
  });
  
  function filterProducts() {
    if (selectedCategory === 'all') {
      return $products;
    }
    return $products.filter(product => product.category === selectedCategory);
  }
  
  $: filteredProducts = filterProducts();
</script>

<div class="container mx-auto px-4 py-12">
  <h1 class="text-5xl font-alex-brush text-pink-400 text-center mb-12">Mystical Shop</h1>
  
  <!-- Category Filter -->
  <div class="flex justify-center mb-12">
    <div class="bg-black/40 backdrop-blur-lg p-2 rounded-2xl border border-pink-500/30">
      {#each categories as category}
        <button
          on:click={() => selectedCategory = category.value}
          class="px-6 py-3 rounded-lg transition-colors {selectedCategory === category.value 
            ? 'bg-pink-500 text-white' 
            : 'text-gray-300 hover:text-pink-400'}"
        >
          {category.label}
        </button>
      {/each}
    </div>
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
    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each filteredProducts as product}
        <ProductCard {product} />
      {/each}
      
      {#if filteredProducts.length === 0}
        <div class="col-span-full text-center py-12">
          <p class="text-gray-400 text-lg">No products found in this category.</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
