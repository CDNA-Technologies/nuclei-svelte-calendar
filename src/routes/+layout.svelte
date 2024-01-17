<script lang="ts">
	import '../global.css';
</script>

<main>
	<body class="bg-base-100">
		<slot />
	</body>
</main>

<style>
	:global(html) {
		font-size: 10px;
	}
	@media (min-width: 281px) {
		:global(html) {
			font-size: 12px;
		}
	}
	@media (min-width: 375px) {
		:global(html) {
			font-size: 14px;
		}
	}
</style>
