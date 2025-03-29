export default function Home() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="text-4xl font-bold mb-4">Herbal Database</h1>
      <p class="mb-4">Welcome to our medicinal herb database.</p>
      <a
        href="/plants"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        View Plants
      </a>
    </div>
  );
}
