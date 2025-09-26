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
